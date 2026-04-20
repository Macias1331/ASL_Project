import cv2
import numpy as np
import base64
import joblib
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.hand_tracker_nms import HandTrackerNMS
import src.extra

try:
    import google.generativeai as genai
except ImportError:
    genai = None

# 1. Initialize FastAPI
app = FastAPI()

# 2. Allow your React frontend to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load your ASL Models (Exactly like your script)
PALM_MODEL_PATH = "models/palm_detection_without_custom_op.tflite"
LANDMARK_MODEL_PATH = "models/hand_landmark.tflite"
ANCHORS_PATH = "models/anchors.csv"

detector = HandTrackerNMS(
    PALM_MODEL_PATH,
    LANDMARK_MODEL_PATH,
    ANCHORS_PATH,
    box_shift=0.2,
    box_enlarge=1.3
)

gesture_clf = joblib.load('models/gesture_clf.pkl')
if hasattr(gesture_clf, 'sigma_') and not hasattr(gesture_clf, 'var_'):
    gesture_clf.var_ = gesture_clf.sigma_

int_to_char = src.extra.classes
gemini_model = None


def get_gemini_model():
    """Lazily initialize Gemini and report status for visibility in UI."""
    global gemini_model

    if gemini_model is not None:
        return gemini_model, "ready", None

    if genai is None:
        return None, "sdk_missing", "google-generativeai is not installed"

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None, "key_missing", "GEMINI_API_KEY is not set"

    try:
        genai.configure(api_key=api_key)
        requested_model = os.getenv("GEMINI_MODEL", "").strip()

        available_models = [
            model.name.replace("models/", "")
            for model in genai.list_models()
            if "generateContent" in getattr(model, "supported_generation_methods", [])
        ]

        if not available_models:
            return None, "models_unavailable", "No Gemini models with generateContent were returned by ListModels"

        model_name = requested_model if requested_model in available_models else available_models[0]
        gemini_model = genai.GenerativeModel(model_name)
        return gemini_model, "ready", None
    except Exception as exc:
        return None, "init_failed", str(exc)


def generate_feedback(target_sign, detected_sign, confidence, top_predictions, failed_attempts):
    model, model_status, model_error = get_gemini_model()
    if model is None:
        return {
            "feedback": "",
            "status": model_status,
            "gemini_used": False,
            "error": model_error,
        }

    alternatives = ", ".join(
        [f"{p['letter']} ({p['probability'] * 100:.1f}%)" for p in top_predictions[:3]]
    )

    prompt = (
        "You are an ASL tutor helping with alphabet practice. "
        f"Target sign: {target_sign}. "
        f"Detected sign: {detected_sign} at {confidence * 100:.1f}% confidence. "
        f"Top alternatives: {alternatives or 'N/A'}. "
        f"Failed attempts on this target: {failed_attempts}. "
        "Give a short tip in 2-3 sentences. Keep it encouraging, specific, and actionable."
    )

    try:
        response = model.generate_content(prompt)
        text = (response.text or "").strip()
        if not text:
            return {
                "feedback": "",
                "status": "empty_response",
                "gemini_used": True,
                "error": "Gemini returned an empty response",
            }

        return {
            "feedback": text,
            "status": "success",
            "gemini_used": True,
            "error": None,
        }
    except Exception as exc:
        return {
            "feedback": "",
            "status": "request_failed",
            "gemini_used": False,
            "error": str(exc),
        }

# 4. Create the "Prediction" Endpoint
@app.post("/predict")
async def predict_asl(request: Request):
    # Receive the image data from React
    data = await request.json()
    image_data = data['image'].split(",")[1] # Remove the "data:image/jpeg;base64," part
    
    # Convert Base64 string back to an OpenCV image
    decoded_data = base64.b64decode(image_data)
    np_data = np.frombuffer(decoded_data, np.uint8)
    frame = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

    # Convert to RGB for MediaPipe/Detector
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Run the detection logic
    points, bboxes, joints = detector(image_rgb)
    
    if points is not None:
        pred_sign, confidence, top_predictions = src.extra.predict_sign(joints, gesture_clf, int_to_char)
        serializable_top_predictions = [
            {
                "letter": letter,
                "probability": float(probability),
            }
            for letter, probability in top_predictions
        ]
        return {
            "prediction": pred_sign,
            "confidence": float(confidence),
            "detected": True,
            "top_predictions": serializable_top_predictions,
        }
    
    return {
        "prediction": "None",
        "confidence": 0,
        "detected": False,
        "top_predictions": [],
    }


@app.post("/feedback")
async def get_asl_feedback(request: Request):
    data = await request.json()
    target_sign = str(data.get("target_sign", "")).upper()
    detected_sign = str(data.get("detected_sign", "None")).upper()
    confidence = float(data.get("confidence", 0))
    failed_attempts = int(data.get("failed_attempts", 0))
    top_predictions = data.get("top_predictions", [])

    if not target_sign:
        return {
            "feedback": "",
            "status": "invalid_request",
            "gemini_used": False,
            "error": "target_sign is required",
        }

    feedback_result = generate_feedback(
        target_sign=target_sign,
        detected_sign=detected_sign,
        confidence=confidence,
        top_predictions=top_predictions,
        failed_attempts=failed_attempts,
    )

    return feedback_result

# 5. Run it with: uvicorn main:app --reload
import cv2
import numpy as np
import base64
import joblib
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.hand_tracker_nms import HandTrackerNMS
import src.extra

# 1. Initialize FastAPI
app = FastAPI()

# 2. Allow your React frontend to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
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
        return {
            "prediction": pred_sign,
            "confidence": float(confidence),
            "detected": True
        }
    
    return {"prediction": "None", "confidence": 0, "detected": False}

# 5. Run it with: uvicorn main:app --reload
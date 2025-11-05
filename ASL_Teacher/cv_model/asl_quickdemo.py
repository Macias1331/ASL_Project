# asl_quickdemo.py
import cv2, mediapipe as mp, numpy as np, time, json, os
from collections import defaultdict
from sklearn.neighbors import KNeighborsClassifier

LETTERS = ["A","B","L","V","Y"]  # small, distinct poses
SAVE_FILE = "asl5_samples.json"

mp_hands = mp.solutions.hands
cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)

def extract_features(landmarks):
    # landmarks: 21 points with x,y,[z] normalized to image size by mediapipe (0..1)
    xy = np.array([[lm.x, lm.y] for lm in landmarks], dtype=np.float32)  # (21,2)
    # normalize: translate wrist to origin, scale by max pairwise distance
    base = xy[0]                          # wrist
    xy_ = xy - base
    scale = np.max(np.linalg.norm(xy_ - xy_[9], axis=1))  # relative to index MCP as a rough scale
    scale = max(scale, 1e-3)
    xy_ /= scale
    # flatten
    return xy_.reshape(-1)                # (42,)

def draw_status(img, lines, y0=30):
    for i, t in enumerate(lines):
        cv2.putText(img, t, (10, y0+28*i),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

# load/save helpers
def load_db():
    if os.path.exists(SAVE_FILE):
        with open(SAVE_FILE, "r") as f:
            raw = json.load(f)
        return {k: [np.array(v, dtype=np.float32) for v in vals] for k, vals in raw.items()}
    return defaultdict(list)

def save_db(db):
    serial = {k: [v.tolist() for v in vals] for k, vals in db.items()}
    with open(SAVE_FILE, "w") as f:
        json.dump(serial, f)

db = load_db()
clf = None
predict_mode = False
last_pred = ("", 0.0)

with mp_hands.Hands(
    static_image_mode=False, max_num_hands=1,
    min_detection_confidence=0.6, min_tracking_confidence=0.6
) as hands:
    while True:
        ok, frame = cap.read()
        if not ok: break
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = hands.process(rgb)

        feat = None
        if res.multi_hand_landmarks:
            hand = res.multi_hand_landmarks[0]
            # draw
            mp.solutions.drawing_utils.draw_landmarks(
                frame, hand, mp.solutions.hands.HAND_CONNECTIONS)
            feat = extract_features(hand.landmark)

        # UI text
        counts = " | ".join([f"{k}:{len(db.get(k,[]))}" for k in LETTERS])
        help1 = "[A/B/L/V/Y] add sample   [T] train   [P] predict on/off   [S] save   [Q] quit"
        status = [f"samples: {counts}", help1]

        # prediction
        if predict_mode and clf is not None and feat is not None:
            proba = clf.predict_proba([feat])[0]
            idx = int(np.argmax(proba))
            last_pred = (clf.classes_[idx], float(proba[idx]))
            cv2.putText(frame, f"{last_pred[0]}  {last_pred[1]:.2f}",
                        (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.8, (0,255,0), 3)

        draw_status(frame, status)
        cv2.imshow("ASL Quick Demo", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'): break

        # record samples
        if key in [ord('a'),ord('b'),ord('l'),ord('v'),ord('y')]:
            if feat is not None:
                label = chr(key).upper()
                db.setdefault(label, []).append(feat)
                print(f"+ sample for {label} (total {len(db[label])})")
            else:
                print("No hand detected — hold the sign clearly in view.")

        # train
        if key == ord('t'):
            X, y = [], []
            for lab, feats in db.items():
                for f in feats:
                    X.append(f); y.append(lab)
            if len(y) >= 10 and len(set(y)) > 1:
                clf = KNeighborsClassifier(n_neighbors=5, weights='distance')
                clf.fit(np.array(X), np.array(y))
                print(f"Trained kNN on {len(y)} samples across {len(set(y))} classes.")
            else:
                print("Need more samples (aim 10–20 per class).")

        # predict toggle
        if key == ord('p'):
            predict_mode = not predict_mode
            print("Predict:", predict_mode)

        # save
        if key == ord('s'):
            save_db(db); print(f"Saved to {SAVE_FILE}")

cap.release(); cv2.destroyAllWindows()
# auto-save on exit
save_db(db)

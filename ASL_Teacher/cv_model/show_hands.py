# show_hands.py
import cv2, mediapipe as mp

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_styles  = mp.solutions.drawing_styles

cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)
with mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
) as hands:
    while True:
        ok, frame = cap.read()
        if not ok: break
        frame = cv2.flip(frame, 1)                 # mirror for selfies
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = hands.process(rgb)

        if res.multi_hand_landmarks:
            for hand in res.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame, hand, mp_hands.HAND_CONNECTIONS,
                    mp_styles.get_default_hand_landmarks_style(),
                    mp_styles.get_default_hand_connections_style()
                )
        cv2.putText(frame, "Hand viewer (q to quit)", (10,30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)
        cv2.imshow("ASL Hand Viewer", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release(); cv2.destroyAllWindows()

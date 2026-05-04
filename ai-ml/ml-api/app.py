import base64
import os
import pickle
import traceback
import warnings

import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

# ── Paths ─────────────────────────────────────
HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(HERE, "model.p")

# ── Load Model ─────────────────────────────────
with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

model = data["model"] if isinstance(data, dict) else data
print("[OK] Model Loaded")

# ── Mediapipe ─────────────────────────────────
mp_hands = mp.solutions.hands

# FIX 1: Lowered min_detection_confidence from 0.4 → 0.3 to handle
# lower-quality images from the mobile camera.
hands_detector = mp_hands.Hands(
    static_image_mode=True,
    min_detection_confidence=0.3,
    max_num_hands=1,
)

# ── Labels ────────────────────────────────────
LABEL_MAP = {
    0:'A',1:'B',2:'C',3:'D',4:'E',5:'F',6:'G',7:'H',8:'I',
    9:'J',10:'K',11:'L',12:'M',13:'N',14:'O',15:'P',16:'Q',
    17:'R',18:'S',19:'T',20:'U',21:'V',22:'W',23:'X',24:'Y',
    25:'Z',
    26:'0',27:'1',28:'2',29:'3',30:'4',
    31:'5',32:'6',33:'7',34:'8',35:'9',
    36:' ',
    37:'.'
}

EXPECTED_FEATURES = 42

# ── Helpers ──────────────────────────────────
def decode_image(image_base64):
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]
    # FIX 2: Pad base64 if needed (mobile can send unpadded base64)
    missing_padding = len(image_base64) % 4
    if missing_padding:
        image_base64 += "=" * (4 - missing_padding)
    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img  # may be None if decode fails — callers must check

def extract_features(hand_landmarks):
    data_aux = []
    x_, y_ = [], []
    for lm in hand_landmarks.landmark:
        x_.append(lm.x)
        y_.append(lm.y)
    for lm in hand_landmarks.landmark:
        data_aux.append(lm.x - min(x_))
        data_aux.append(lm.y - min(y_))
    if len(data_aux) < EXPECTED_FEATURES:
        data_aux.extend([0] * (EXPECTED_FEATURES - len(data_aux)))
    return np.array(data_aux[:EXPECTED_FEATURES])

def try_detect_hand(img_rgb):
    """Try to detect hand. Returns hand_landmarks or None."""
    results = hands_detector.process(img_rgb)
    if results.multi_hand_landmarks:
        return results.multi_hand_landmarks[0]
    return None

def predict_char(img):
    """
    FIX 3: Try all 4 rotations of the image when detecting hands.
    expo-camera with skipProcessing:true on Android often sends the image
    rotated 90° or 270°. MediaPipe fails to detect hands in rotated images.
    By trying all rotations we always find the hand regardless of device
    orientation or expo-camera processing mode.
    """
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Rotations to try: 0°, 90° CW, 180°, 90° CCW
    rotations = [
        img_rgb,
        cv2.rotate(img_rgb, cv2.ROTATE_90_CLOCKWISE),
        cv2.rotate(img_rgb, cv2.ROTATE_180),
        cv2.rotate(img_rgb, cv2.ROTATE_90_COUNTERCLOCKWISE),
    ]

    hand_landmarks = None
    for rotated in rotations:
        hand_landmarks = try_detect_hand(rotated)
        if hand_landmarks:
            break

    if not hand_landmarks:
        return None

    features = extract_features(hand_landmarks)
    prediction = model.predict([features])
    predicted_char = LABEL_MAP[int(prediction[0])]

    confidence = 1.0
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba([features])[0]
        confidence = float(np.max(proba))

    return {"prediction": predicted_char, "confidence": confidence}

# ── Flask App ─────────────────────────────────
app = Flask(__name__)
CORS(app)

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/predict-sign")
def predict_sign():
    req_data = request.get_json()
    image_base64 = req_data.get("imageBase64")

    if not image_base64:
        return jsonify({"error": "No image"}), 400

    try:
        img = decode_image(image_base64)

        # FIX 4: Check if image decoded successfully before processing.
        # cv2.imdecode silently returns None on corrupt/truncated JPEG.
        # Previously this would crash on cvtColor giving a 500 error
        # that the frontend showed as "API Error" instead of the real problem.
        if img is None:
            return jsonify({
                "prediction": None,
                "confidence": 0.0,
                "message": "Could not decode image — try increasing camera quality"
            })

        result = predict_char(img)

        if result is None:
            return jsonify({
                "prediction": None,
                "confidence": 0.0,
                "message": "No hand detected"
            })

        return jsonify({
            "prediction": result["prediction"],
            "confidence": result["confidence"],
        })

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Prediction failed"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

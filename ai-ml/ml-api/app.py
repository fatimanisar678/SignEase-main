"""
SignEase ML API — Flask server — TF-FREE VERSION (FIXED)

NOW DEFAULTS TO SKLEARN MODEL ONLY (.p)
TensorFlow support is removed to avoid crashes.

Model:
  model.p  (sklearn only)
"""

import base64
import os
import pickle
import traceback

import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

# ── Model loading ──────────────────────────────────────────────────────────────

HERE = os.path.dirname(os.path.abspath(__file__))

# FORCE SKLEARN MODEL ONLY
MODEL_PATH = os.environ.get(
    "SIGNEASE_MODEL_PATH",
    os.path.join(HERE, "model.p"),
)

MODEL_TYPE = "sklearn"
model = None


def _load_model():
    global model

    if not os.path.exists(MODEL_PATH):
        print(f"[ERROR] Model file not found: {MODEL_PATH}")
        print("👉 Place model.p in same folder as app.py")
        return

    try:
        with open(MODEL_PATH, "rb") as f:
            data = pickle.load(f)

        model = data["model"]

        print(f"[OK] sklearn model loaded from {MODEL_PATH}")

    except Exception as e:
        print(f"[ERROR] Failed to load model: {e}")


_load_model()

# ── MediaPipe ──────────────────────────────────────────────────────────────────

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands_detector = mp_hands.Hands(
    static_image_mode=True,
    min_detection_confidence=0.4,
    max_num_hands=1,
)

# ── Labels ─────────────────────────────────────────────────────────────────────

SKLEARN_LABELS = {
    **{i: chr(65 + i) for i in range(26)},
    **{26 + i: str(i) for i in range(10)},
    36: " ",
    37: ".",
}

EXPECTED_SKLEARN_FEATURES = 42

# ── Helpers ───────────────────────────────────────────────────────────────────

def _decode_base64_image(image_base64: str):
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]
    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def _get_hand_landmarks(img_bgr):
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(img_rgb)
    if not results.multi_hand_landmarks:
        return None
    return results.multi_hand_landmarks[0]


def _extract_features(hand_landmarks):
    x_ = [lm.x for lm in hand_landmarks.landmark]
    y_ = [lm.y for lm in hand_landmarks.landmark]

    min_x, min_y = min(x_), min(y_)

    features = []
    for lm in hand_landmarks.landmark:
        features.append(lm.x - min_x)
        features.append(lm.y - min_y)

    if len(features) < EXPECTED_SKLEARN_FEATURES:
        features += [0.0] * (EXPECTED_SKLEARN_FEATURES - len(features))

    return features[:EXPECTED_SKLEARN_FEATURES]


def _predict(hand_landmarks):
    features = _extract_features(hand_landmarks)
    raw = model.predict([np.asarray(features)])[0]
    print(f"[RAW] Model predicted: {raw} (type: {type(raw)})")
    try:
        return SKLEARN_LABELS.get(int(raw), str(raw))
    except:
        return str(raw)


# ── Flask App ──────────────────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "modelPath": MODEL_PATH,
        "modelType": MODEL_TYPE,
        "modelLoaded": model is not None,
    })


@app.post("/predict-sign")
def predict_sign():
    payload = request.get_json(silent=True) or {}
    image_base64 = payload.get("imageBase64") or payload.get("image")

    if not image_base64:
        return jsonify({"message": "imageBase64 is required"}), 400

    if model is None:
        return jsonify({"message": "Model not loaded"}), 503

    try:
        img_bgr = _decode_base64_image(image_base64)
        if img_bgr is None:
            return jsonify({"message": "Invalid image"}), 400

        # We will try both the original and flipped versions to handle mirrored cameras
        # and pick the one with the highest confidence.
        
        results = []

        # 1. Try Original
        hand_orig = _get_hand_landmarks(img_bgr)
        if hand_orig:
            features = _extract_features(hand_orig)
            probs = model.predict_proba([np.asarray(features)])[0]
            max_prob = np.max(probs)
            class_idx = model.classes_[np.argmax(probs)]
            results.append({"prob": max_prob, "class": class_idx, "flip": False})

        # 2. Try Flipped
        img_flipped = cv2.flip(img_bgr, 1)
        hand_flip = _get_hand_landmarks(img_flipped)
        if hand_flip:
            features = _extract_features(hand_flip)
            probs = model.predict_proba([np.asarray(features)])[0]
            max_prob = np.max(probs)
            class_idx = model.classes_[np.argmax(probs)]
            results.append({"prob": max_prob, "class": class_idx, "flip": True})

        if not results:
            # Last ditch: try rotation
            img_rot = cv2.rotate(img_bgr, cv2.ROTATE_90_CLOCKWISE)
            hand_rot = _get_hand_landmarks(img_rot)
            if hand_rot:
                features = _extract_features(hand_rot)
                probs = model.predict_proba([np.asarray(features)])[0]
                max_prob = np.max(probs)
                class_idx = model.classes_[np.argmax(probs)]
                results.append({"prob": max_prob, "class": class_idx, "rot": True})

        if not results:
            return jsonify({"prediction": None, "message": "No hand detected"}), 200

        # Sort by confidence
        best = sorted(results, key=lambda x: x["prob"], reverse=True)[0]
        raw_val = best["class"]
        
        prediction = SKLEARN_LABELS.get(int(raw_val), str(raw_val))
        print(f"[DEBUG] Confidence: {best['prob']:.2f}, Flip: {best.get('flip', False)}, Prediction: {prediction}")

        return jsonify({
            "prediction": prediction,
            "confidence": float(best["prob"]),
            "isMirrored": best.get("flip", False)
        })

    except Exception:
        traceback.print_exc()
        return jsonify({
            "message": "Prediction failed",
            "error": traceback.format_exc()
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
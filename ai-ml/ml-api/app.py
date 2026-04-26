import base64
import os
import pickle

import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS


def _repo_root() -> str:
    here = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(here, ".."))


def _default_model_path() -> str:
    # Use pretrained model from the imported GitHub repo
    return os.path.join(
        _repo_root(),
        "Sign-Language-to-Text-and-Speech",
        "model.p",
    )


MODEL_PATH = os.environ.get("SIGNEASE_MODEL_PATH", _default_model_path())

model_dict = pickle.load(open(MODEL_PATH, "rb"))
model = model_dict["model"]


mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3, max_num_hands=1)

LABELS_DICT = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
    7: "H",
    8: "I",
    9: "J",
    10: "K",
    11: "L",
    12: "M",
    13: "N",
    14: "O",
    15: "P",
    16: "Q",
    17: "R",
    18: "S",
    19: "T",
    20: "U",
    21: "V",
    22: "W",
    23: "X",
    24: "Y",
    25: "Z",
    26: "0",
    27: "1",
    28: "2",
    29: "3",
    30: "4",
    31: "5",
    32: "6",
    33: "7",
    34: "8",
    35: "9",
    36: " ",
    37: ".",
}

EXPECTED_FEATURES = 42  # 21 landmarks × (x,y)

app = Flask(__name__)
CORS(app)


def _decode_image_base64(image_base64: str) -> np.ndarray:
    # Accept both raw base64 and data URLs like "data:image/jpeg;base64,...."
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]
    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    img_bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img_bgr


def _extract_hand_features(img_bgr: np.ndarray) -> list[float] | None:
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)
    if not results.multi_hand_landmarks:
        return None

    hand_landmarks = results.multi_hand_landmarks[0]
    x_ = []
    y_ = []
    for lm in hand_landmarks.landmark:
        x_.append(lm.x)
        y_.append(lm.y)

    data_aux = []
    min_x = min(x_)
    min_y = min(y_)
    for lm in hand_landmarks.landmark:
        data_aux.append(lm.x - min_x)
        data_aux.append(lm.y - min_y)

    if len(data_aux) < EXPECTED_FEATURES:
        data_aux.extend([0.0] * (EXPECTED_FEATURES - len(data_aux)))
    elif len(data_aux) > EXPECTED_FEATURES:
        data_aux = data_aux[:EXPECTED_FEATURES]

    return data_aux


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "signease-ml", "modelPath": MODEL_PATH})


@app.post("/predict-sign")
def predict_sign():
    payload = request.get_json(silent=True) or {}
    image_base64 = payload.get("imageBase64") or payload.get("image")
    if not image_base64:
        return jsonify({"message": "imageBase64 is required"}), 400

    try:
        img_bgr = _decode_image_base64(image_base64)
        if img_bgr is None:
            return jsonify({"message": "Invalid image data"}), 400

        features = _extract_hand_features(img_bgr)
        if features is None:
            return jsonify({"prediction": None, "message": "No hand detected"}), 200

        pred = model.predict([np.asarray(features)])[0]
        pred_int = int(pred)
        pred_label = LABELS_DICT.get(pred_int, str(pred_int))
        return jsonify({"prediction": pred_label})
    except Exception as e:
        return jsonify({"message": "Prediction failed", "error": str(e)}), 500


if __name__ == "__main__":
    # Local dev: http://localhost:8000
    app.run(host="0.0.0.0", port=8000, debug=True)


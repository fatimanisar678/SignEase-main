import base64
import os
import pickle
import traceback
import warnings
import time

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
model = None

with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

model = data["model"] if isinstance(data, dict) else data

print("[OK] Model Loaded")

# ── Mediapipe ─────────────────────────────────
mp_hands = mp.solutions.hands
hands_detector = mp_hands.Hands(
    static_image_mode=True,
    min_detection_confidence=0.4,
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

# ── STATE (from main.py) ──────────────────────
stabilization_buffer = []
stable_char = None
word_buffer = ""
sentence = ""
last_registered_time = time.time()
registration_delay = 1.5

# ── Helpers ──────────────────────────────────
def decode_image(image_base64):
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]
    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)

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

def predict_char(img):
    global stabilization_buffer, stable_char, word_buffer, sentence, last_registered_time

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(img_rgb)

    if not results.multi_hand_landmarks:
        return None

    hand_landmarks = results.multi_hand_landmarks[0]
    features = extract_features(hand_landmarks)

    prediction = model.predict([features])
    predicted_char = LABEL_MAP[int(prediction[0])]

    # 🔥 Stabilization logic (from main.py)
    stabilization_buffer.append(predicted_char)
    if len(stabilization_buffer) > 30:
        stabilization_buffer.pop(0)

    if stabilization_buffer.count(predicted_char) > 25:
        current_time = time.time()

        if current_time - last_registered_time > registration_delay:
            stable_char = predicted_char
            last_registered_time = current_time

            if stable_char == ' ':
                if word_buffer.strip():
                    sentence_update = word_buffer + " "
                    word_buffer_local = ""
                    return {
                        "char": stable_char,
                        "word": "",
                        "sentence_update": sentence_update
                    }

            elif stable_char == '.':
                if word_buffer.strip():
                    sentence_update = word_buffer + "."
                    word_buffer_local = ""
                    return {
                        "char": stable_char,
                        "word": "",
                        "sentence_update": sentence_update
                    }

            else:
                return {
                    "char": stable_char,
                    "word": stable_char,
                    "sentence_update": ""
                }

    return None

# ── Flask App ─────────────────────────────────
app = Flask(__name__)
CORS(app)

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/predict-sign")
def predict_sign():
    global word_buffer, sentence

    data = request.get_json()
    image_base64 = data.get("imageBase64")

    if not image_base64:
        return jsonify({"error": "No image"}), 400

    try:
        img = decode_image(image_base64)
        result = predict_char(img)

        if result is None:
            return jsonify({"prediction": None})

        # 🔥 Word & Sentence handling
        if result["sentence_update"]:
            sentence += result["sentence_update"]
            word_buffer = ""

        elif result["word"]:
            word_buffer += result["word"]

        return jsonify({
            "char": result["char"],
            "word": word_buffer,
            "sentence": sentence
        })

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Prediction failed"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
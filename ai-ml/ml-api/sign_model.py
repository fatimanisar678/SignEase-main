import pickle
import mediapipe as mp
import numpy as np
import cv2

# Load model
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

# Mediapipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.5)

# Labels (same jo tumhare main.py me hain)
labels_dict = {
    0:'A',1:'B',2:'C',3:'D',4:'E',5:'F',6:'G',7:'H',8:'I',
    9:'J',10:'K',11:'L',12:'M',13:'N',14:'O',15:'P',16:'Q',
    17:'R',18:'S',19:'T',20:'U',21:'V',22:'W',23:'X',24:'Y',
    25:'Z'
}

def predict_from_image(image):
    data_aux = []
    x_ = []
    y_ = []

    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            for lm in hand_landmarks.landmark:
                x_.append(lm.x)
                y_.append(lm.y)

            for lm in hand_landmarks.landmark:
                data_aux.append(lm.x - min(x_))
                data_aux.append(lm.y - min(y_))

        prediction = model.predict([np.asarray(data_aux)])
        predicted_character = labels_dict[int(prediction[0])]

        return predicted_character

    return "No Hand"
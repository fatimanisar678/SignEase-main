"""
retrain_model.py — SignEase Model Retrainer
============================================
Run this script to re-train the Random Forest classifier using your webcam
or a dataset of hand sign images. It will produce a new model.p compatible
with your installed scikit-learn version.

USAGE:
  python retrain_model.py            # collect data interactively via webcam
  python retrain_model.py --quick    # use synthetic data for testing only

This script collects 42 MediaPipe landmark features per image and trains
a RandomForestClassifier (same architecture as the original model).
"""

import argparse
import os
import pickle
import time

import cv2
import mediapipe as mp
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

HERE = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(HERE, "model.p")
DATA_PATH = os.path.join(HERE, "training_data.pkl")

LABELS = {
    **{chr(65 + i): i for i in range(26)},   # A-Z → 0-25
    **{str(i): 26 + i for i in range(10)},    # 0-9 → 26-35
}

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.4)


def extract_features(img_bgr):
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    result = hands.process(img_rgb)
    if not result.multi_hand_landmarks:
        return None
    lm = result.multi_hand_landmarks[0]
    xs = [p.x for p in lm.landmark]
    ys = [p.y for p in lm.landmark]
    min_x, min_y = min(xs), min(ys)
    features = []
    for p in lm.landmark:
        features.append(p.x - min_x)
        features.append(p.y - min_y)
    return np.array(features[:42], dtype=np.float32)


# ── OPTION A: Collect via webcam ───────────────────────────────────────────────
def collect_webcam_data(samples_per_class=50):
    print("\n📷  WEBCAM DATA COLLECTION MODE")
    print("="*50)
    print("You will show each hand sign to the camera.")
    print(f"We need {samples_per_class} samples per class.")
    print("Press SPACE to capture, Q to quit, ENTER to move to next class.\n")

    classes_to_collect = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ") + [str(i) for i in range(10)]
    X, y = [], []

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Cannot open webcam. Use --quick mode or provide dataset.")
        return None, None

    for label in classes_to_collect:
        class_id = LABELS[label]
        count = 0
        print(f"\n  → Show sign for: [{label}]  (need {samples_per_class} samples)")
        print("    Press SPACE to start capturing...")

        capturing = False
        while count < samples_per_class:
            ret, frame = cap.read()
            if not ret:
                break

            display = frame.copy()
            cv2.putText(display, f"Sign: {label}  Captured: {count}/{samples_per_class}",
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            if capturing:
                cv2.putText(display, "CAPTURING...", (10, 70),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                feat = extract_features(frame)
                if feat is not None:
                    X.append(feat)
                    y.append(class_id)
                    count += 1
                    time.sleep(0.1)
            else:
                cv2.putText(display, "Press SPACE to start", (10, 70),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

            cv2.imshow("Collect Sign Data", display)
            key = cv2.waitKey(1) & 0xFF
            if key == ord(' '):
                capturing = not capturing
            elif key == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                return np.array(X), np.array(y)
            elif key == 13:  # Enter
                break

        print(f"  ✓ Collected {count} samples for [{label}]")

    cap.release()
    cv2.destroyAllWindows()
    return np.array(X), np.array(y)


# ── OPTION B: Load from image dataset folder ───────────────────────────────────
def load_from_dataset(dataset_dir):
    """Load from folder structure: dataset_dir/A/*.jpg, dataset_dir/B/*.jpg etc."""
    print(f"\n📁 Loading dataset from: {dataset_dir}")
    X, y = [], []

    for label, class_id in LABELS.items():
        class_dir = os.path.join(dataset_dir, label)
        if not os.path.isdir(class_dir):
            continue
        images = [f for f in os.listdir(class_dir)
                  if f.lower().endswith((".jpg", ".jpeg", ".png"))]
        for img_file in images:
            img = cv2.imread(os.path.join(class_dir, img_file))
            if img is None:
                continue
            feat = extract_features(img)
            if feat is not None:
                X.append(feat)
                y.append(class_id)

        print(f"  Loaded {len([i for i in y if i == class_id])} samples for [{label}]")

    return np.array(X), np.array(y)


# ── OPTION C: Quick synthetic test (NOT for production) ───────────────────────
def generate_quick_synthetic():
    """
    TESTING ONLY — generates random feature vectors so the model file exists.
    Accuracy will be poor. Use webcam or dataset for a real model.
    """
    print("\n⚡ QUICK MODE — generating synthetic training data")
    print("   WARNING: This model will NOT work well for real predictions!")
    print("   Use webcam mode for a real model.\n")

    np.random.seed(42)
    n_classes = 38
    n_per_class = 100
    X, y = [], []

    for c in range(n_classes):
        # Create class-specific feature distribution
        center = np.random.rand(42) * 0.3
        for _ in range(n_per_class):
            sample = center + np.random.randn(42) * 0.05
            X.append(np.clip(sample, 0, 1))
            y.append(c)

    return np.array(X), np.array(y)


# ── Train ──────────────────────────────────────────────────────────────────────
def train_and_save(X, y):
    print(f"\n🔧 Training RandomForestClassifier...")
    print(f"   Samples: {len(X)}")
    print(f"   Classes: {len(np.unique(y))}")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        random_state=42,
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"   Test accuracy: {acc*100:.1f}%")

    # Convert labels back to string class names (matching original model format)
    # The original model uses string class indices
    from sklearn.ensemble import RandomForestClassifier as RFC

    # Re-map y to string class indices to match original format
    clf_final = RandomForestClassifier(n_estimators=100, max_depth=None, random_state=42, n_jobs=-1)
    y_str = np.array([str(v) for v in y])
    clf_final.fit(X, y_str)

    with open(OUTPUT_PATH, "wb") as f:
        pickle.dump({"model": clf_final}, f)

    print(f"\n✅ Model saved to: {OUTPUT_PATH}")
    print(f"   Classes: {clf_final.classes_[:10]}... ({len(clf_final.classes_)} total)")
    print(f"   Features: {clf_final.n_features_in_}")
    return clf_final


# ── Main ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SignEase Model Retrainer")
    parser.add_argument("--quick", action="store_true",
                        help="Use synthetic data (for testing only)")
    parser.add_argument("--dataset", type=str, default=None,
                        help="Path to image dataset folder")
    args = parser.parse_args()

    if args.quick:
        X, y = generate_quick_synthetic()
    elif args.dataset:
        X, y = load_from_dataset(args.dataset)
    else:
        X, y = collect_webcam_data(samples_per_class=60)

    if X is None or len(X) == 0:
        print("[ERROR] No training data collected.")
        exit(1)

    train_and_save(X, y)
    print("\n🎉 Done! Restart the ML API server now.")

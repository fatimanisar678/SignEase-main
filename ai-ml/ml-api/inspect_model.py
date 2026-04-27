import pickle
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(HERE, "model.p")

if not os.path.exists(MODEL_PATH):
    print("Model not found")
    exit()

with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

print("--- Model Metadata ---")
for key in data.keys():
    print(f"Key: {key}")

model = data["model"]
print(f"\nModel Type: {type(model)}")

if hasattr(model, "classes_"):
    print(f"Classes: {model.classes_}")
    print(f"Number of classes: {len(model.classes_)}")
else:
    print("No classes_ attribute found")

if hasattr(model, "n_features_in_"):
    print(f"Expected features: {model.n_features_in_}")

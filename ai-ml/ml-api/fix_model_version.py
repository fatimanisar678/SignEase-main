"""
fix_model_version.py
====================
Run this ONCE to re-save model.p with your currently installed
scikit-learn version. This eliminates the InconsistentVersionWarning
and prevents potential prediction failures due to version mismatch.

Usage:
    python fix_model_version.py
"""
import os
import pickle
import warnings

warnings.filterwarnings("ignore")

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(HERE, "model.p")
BACKUP_PATH = os.path.join(HERE, "model_original_backup.p")

import sklearn
print(f"Current scikit-learn version: {sklearn.__version__}")

if not os.path.exists(MODEL_PATH):
    print(f"[ERROR] model.p not found at: {MODEL_PATH}")
    exit(1)

# Load with warnings suppressed
with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

model = data["model"] if isinstance(data, dict) else data
print(f"Model type: {type(model).__name__}")
print(f"Features:   {model.n_features_in_}")
print(f"Classes:    {len(model.classes_)}")

# Back up original
import shutil
shutil.copy(MODEL_PATH, BACKUP_PATH)
print(f"\nBackup saved: {BACKUP_PATH}")

# Re-save with current sklearn version
with open(MODEL_PATH, "wb") as f:
    pickle.dump({"model": model}, f)

print(f"Model re-saved: {MODEL_PATH}")
print("\n✅ Done! Version mismatch fixed. Restart app.py.")

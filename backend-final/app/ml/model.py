import joblib
from pathlib import Path

# Load model only once when backend starts

MODEL_PATH = Path(__file__).parent/ "adaboost_classifier.joblib"
SCALER_PATH = Path(__file__).parent / "scaler.joblib"

# Load the model
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("Adaboost model and scaler loaded succesfully!")
except Exception as e:
    print(f"Failed to load model or scaler; {e}")
    model = None
    scaler = None

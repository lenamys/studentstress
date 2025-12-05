import joblib
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Load model only once when backend starts

MODEL_PATH = BASE_DIR / "adaboost_classifier.joblib"
REGRESSION_MODEL_PATH = BASE_DIR / "logistic_regression_classifier.joblib"
RF_MODEL_PATH = BASE_DIR / "rf_classifier.joblib"
SCALER_PATH = Path(__file__).parent / "adaboost_scaler.joblib"
REGRESSION_SCALER_PATH = BASE_DIR / "regression_scaler.joblib"
RF_SCALER_PATH = BASE_DIR / "rf_scaler.joblib"

def load_joblib(path):
    try:
        return joblib.load(path)
    except Exception as e:
        print(f"Failed to load {path.name} : {e}")
        return None

# Load the model and scalar
model = load_joblib(MODEL_PATH)
regression_model = load_joblib(REGRESSION_MODEL_PATH)
rf_model = load_joblib(RF_MODEL_PATH)
scaler = load_joblib(SCALER_PATH)
regression_scaler = load_joblib(REGRESSION_SCALER_PATH)
rf_scaler = load_joblib(RF_SCALER_PATH)

print("Models loaded:",
      f"Adaboost={'OK' if model else 'FAIL'} |",
      f"Regression={'OK' if regression_model else 'FAIL'} |",
      f"RF={'OK' if rf_model else 'FAIL'} |",
      f"Scaler={'OK' if scaler else 'FAIL'}")

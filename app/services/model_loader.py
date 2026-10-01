import logging
from pathlib import Path
import joblib
from app.config import settings

logger = logging.getLogger("machine_health_api")

failure_model = None
cost_model = None
classification_scaler = None
regression_scaler = None
type_encoder = None
is_loaded = False


def load_models():
    global failure_model, cost_model, classification_scaler, regression_scaler, type_encoder, is_loaded
    models_dir = Path(settings.MODELS_DIR)

    try:
        failure_model = joblib.load(models_dir / "failure_model.pkl")
        cost_model = joblib.load(models_dir / "cost_model.pkl")
        classification_scaler = joblib.load(models_dir / "classification_scaler.pkl")
        regression_scaler = joblib.load(models_dir / "regression_scaler.pkl")
        type_encoder = joblib.load(models_dir / "type_encoder.pkl")
        is_loaded = True
        logger.info("All scikit-learn models and scalers loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load machine learning models from {models_dir}: {e}")
        is_loaded = False


# Load once at module import
load_models()


def are_models_loaded() -> bool:
    return is_loaded

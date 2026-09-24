import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

MODELS_DIR = "models"

# ---- load everything the notebook saved, once at startup ----
failure_model = joblib.load(os.path.join(MODELS_DIR, "failure_model.pkl"))
cost_model = joblib.load(os.path.join(MODELS_DIR, "cost_model.pkl"))
classification_scaler = joblib.load(os.path.join(MODELS_DIR, "classification_scaler.pkl"))
regression_scaler = joblib.load(os.path.join(MODELS_DIR, "regression_scaler.pkl"))
type_encoder = joblib.load(os.path.join(MODELS_DIR, "type_encoder.pkl"))

# exact column order both models were trained on (X and X_reg had the
# same 9 columns, in this order, in the notebook)
FEATURE_COLUMNS = [
    "Type",
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]",
    "Temperature difference",
    "Average Temperature",
    "Power",
]


class MachineInput(BaseModel):
    type: str = Field(..., description="Product quality type: 'L', 'M', or 'H'")
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float


def build_features(data: MachineInput) -> pd.DataFrame:
    """Raw input ko un exact engineered columns mein badalta hai jinpe
    model train hua tha (Type encode, temp diff, avg temp, power)."""
    try:
        type_encoded = type_encoder.transform([data.type])[0]
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail=f"'type' must be one of {list(type_encoder.classes_)}, got '{data.type}'"
        )

    temp_diff = data.process_temperature - data.air_temperature
    avg_temp = (data.process_temperature + data.air_temperature) / 2
    power = data.rotational_speed * data.torque

    row = {
        "Type": type_encoded,
        "Air temperature [K]": data.air_temperature,
        "Process temperature [K]": data.process_temperature,
        "Rotational speed [rpm]": data.rotational_speed,
        "Torque [Nm]": data.torque,
        "Tool wear [min]": data.tool_wear,
        "Temperature difference": temp_diff,
        "Average Temperature": avg_temp,
        "Power": power,
    }
    return pd.DataFrame([row])[FEATURE_COLUMNS]


@app.get("/")
def home():
    return {"message": "Machine Health API is running"}


@app.post("/predict/failure")
def predict_failure(data: MachineInput):
    row = build_features(data)
    row_scaled = classification_scaler.transform(row)

    prediction = int(failure_model.predict(row_scaled)[0])

    if hasattr(failure_model, "predict_proba"):
        probability = float(failure_model.predict_proba(row_scaled)[0][1])
    else:
        probability = float(prediction)

    return {
        "failure_prediction": prediction,
        "failure_probability": round(probability, 4)
    }


@app.post("/predict/cost")
def predict_cost(data: MachineInput):
    row = build_features(data)
    row_scaled = regression_scaler.transform(row)

    cost = max(float(cost_model.predict(row_scaled)[0]), 0.0)

    return {"estimated_cost": round(cost, 2)}
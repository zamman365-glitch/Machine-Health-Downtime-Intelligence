import pandas as pd
from fastapi import HTTPException
from app.schemas import MachineInput
import app.services.model_loader as ml

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


def build_features(data: MachineInput) -> pd.DataFrame:
    if not ml.are_models_loaded():
        raise HTTPException(status_code=500, detail="Machine learning models not initialized.")

    try:
        type_encoded = ml.type_encoder.transform([data.type])[0]
    except (ValueError, KeyError, AttributeError):
        classes = list(ml.type_encoder.classes_) if hasattr(ml.type_encoder, "classes_") else ["L", "M", "H"]
        raise HTTPException(
            status_code=422,
            detail=f"'type' must be one of {classes}, got '{data.type}'"
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

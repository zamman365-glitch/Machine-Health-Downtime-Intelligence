import uuid
from fastapi import HTTPException
from app.schemas import (
    MachineInput,
    FailurePredictionResponse,
    CostPredictionResponse,
    UnifiedPredictionResponse,
)
import app.services.model_loader as ml
from app.services.features import build_features
from app.db import run_insert


def predict_failure_service(data: MachineInput):
    row = build_features(data)
    row_scaled = ml.classification_scaler.transform(row)

    prediction = int(ml.failure_model.predict(row_scaled)[0])

    if hasattr(ml.failure_model, "predict_proba"):
        probability = float(ml.failure_model.predict_proba(row_scaled)[0][1])
    else:
        probability = float(prediction)

    return prediction, round(probability, 4)


def predict_cost_service(data: MachineInput):
    row = build_features(data)
    row_scaled = ml.regression_scaler.transform(row)

    cost = max(float(ml.cost_model.predict(row_scaled)[0]), 0.0)
    return round(cost, 2)


def run_legacy_failure_prediction(data: MachineInput) -> FailurePredictionResponse:
    prediction, probability = predict_failure_service(data)

    run_insert(
        """
        INSERT INTO predictions (failure_prediction, failure_probability)
        VALUES (%s, %s)
        """,
        (bool(prediction), probability),
    )

    return FailurePredictionResponse(
        failure_prediction=prediction,
        failure_probability=probability
    )


def run_legacy_cost_prediction(data: MachineInput) -> CostPredictionResponse:
    cost = predict_cost_service(data)

    run_insert(
        "INSERT INTO predictions (predicted_cost) VALUES (%s)",
        (cost,),
    )

    return CostPredictionResponse(
        estimated_cost=cost
    )


def run_unified_prediction(data: MachineInput) -> UnifiedPredictionResponse:
    req_id = str(uuid.uuid4())
    prediction, probability = predict_failure_service(data)
    cost = predict_cost_service(data)

    run_insert(
        """
        INSERT INTO predictions (
            request_id,
            created_at,
            machine_type,
            air_temperature,
            process_temperature,
            rotational_speed,
            torque,
            tool_wear,
            failure_prediction,
            failure_probability,
            predicted_cost
        )
        VALUES (%s, NOW(), %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            req_id,
            data.type,
            data.air_temperature,
            data.process_temperature,
            data.rotational_speed,
            data.torque,
            data.tool_wear,
            bool(prediction),
            probability,
            cost,
        ),
    )

    return UnifiedPredictionResponse(
        failure_prediction=prediction,
        failure_probability=probability,
        estimated_cost=cost
    )

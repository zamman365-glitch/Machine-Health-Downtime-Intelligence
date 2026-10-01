from fastapi import APIRouter, Query, HTTPException
from app.schemas import (
    MachineInput,
    FailurePredictionResponse,
    CostPredictionResponse,
    UnifiedPredictionResponse,
    PaginatedPredictionsResponse,
    PredictionItem,
)
from app.services.prediction import (
    run_legacy_failure_prediction,
    run_legacy_cost_prediction,
    run_unified_prediction,
)
from app.db import run_query

router = APIRouter(tags=["Predictions"])


@router.post("/predict/failure", response_model=FailurePredictionResponse, summary="Predict machine failure probability")
def predict_failure(data: MachineInput):
    return run_legacy_failure_prediction(data)


@router.post("/predict/cost", response_model=CostPredictionResponse, summary="Predict maintenance cost")
def predict_cost(data: MachineInput):
    return run_legacy_cost_prediction(data)


@router.post("/predict", response_model=UnifiedPredictionResponse, summary="Unified failure and cost prediction")
def predict_all(data: MachineInput):
    return run_unified_prediction(data)


@router.get("/predictions", response_model=PaginatedPredictionsResponse, summary="Get prediction logs history")
def get_predictions(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    try:
        count_row = run_query("SELECT COUNT(*) FROM predictions;", fetch_one=True)
        total = count_row[0] if count_row else 0

        query = """
            SELECT
                prediction_id,
                request_id::text,
                COALESCE(created_at, predicted_at) AS created_at,
                machine_type,
                air_temperature,
                process_temperature,
                rotational_speed,
                torque,
                tool_wear,
                CASE WHEN failure_prediction IS TRUE THEN 1 WHEN failure_prediction IS FALSE THEN 0 ELSE NULL END AS failure_prediction,
                failure_probability,
                predicted_cost
            FROM predictions
            ORDER BY COALESCE(created_at, predicted_at) DESC, prediction_id DESC
            LIMIT %s OFFSET %s;
        """
        rows = run_query(query, (limit, offset), fetch_all=True) or []

        items = []
        for r in rows:
            items.append(
                PredictionItem(
                    prediction_id=r[0],
                    request_id=r[1],
                    created_at=r[2],
                    machine_type=r[3],
                    air_temperature=float(r[4]) if r[4] is not null and r[4] is not None else None,
                    process_temperature=float(r[5]) if r[5] is not null and r[5] is not None else None,
                    rotational_speed=float(r[6]) if r[6] is not null and r[6] is not None else None,
                    torque=float(r[7]) if r[7] is not null and r[7] is not None else None,
                    tool_wear=float(r[8]) if r[8] is not null and r[8] is not None else None,
                    failure_prediction=int(r[9]) if r[9] is not None else None,
                    failure_probability=float(r[10]) if r[10] is not None else None,
                    predicted_cost=float(r[11]) if r[11] is not None else None,
                )
            )

        return PaginatedPredictionsResponse(
            total=total,
            limit=limit,
            offset=offset,
            items=items
        )
    except HTTPException:
        raise
    except Exception as e:
        return PaginatedPredictionsResponse(
            total=0,
            limit=limit,
            offset=offset,
            items=[]
        )

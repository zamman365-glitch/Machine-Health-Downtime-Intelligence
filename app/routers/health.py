from fastapi import APIRouter
from app.schemas import HealthResponse
from app.db import check_db_health
import app.services.model_loader as ml

router = APIRouter(tags=["Health"])


@router.get("/", summary="Root health status")
def home():
    return {"message": "Machine Health API is running"}


@router.get("/health", response_model=HealthResponse, summary="Detailed system health check")
def health_check():
    db_ok = check_db_health()
    models_ok = ml.are_models_loaded()
    
    overall_status = "ok" if (db_ok and models_ok) else "degraded"
    
    return HealthResponse(
        status=overall_status,
        model_loaded=models_ok,
        database="ok" if db_ok else "down"
    )

import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


class MachineInput(BaseModel):
    type: str = Field(..., description="Product quality type: 'L', 'M', or 'H'")
    air_temperature: float = Field(..., gt=0, description="Air temperature in Kelvin (>0)")
    process_temperature: float = Field(..., gt=0, description="Process temperature in Kelvin (>0)")
    rotational_speed: float = Field(..., gt=0, description="Rotational speed in rpm (>0)")
    torque: float = Field(..., gt=0, description="Torque in Nm (>0)")
    tool_wear: float = Field(..., ge=0, description="Tool wear in minutes (>=0)")

    @model_validator(mode="after")
    def validate_temperatures(self):
        if self.process_temperature <= self.air_temperature:
            raise ValueError("process_temperature must be greater than air_temperature")
        return self


class FailurePredictionResponse(BaseModel):
    failure_prediction: int
    failure_probability: float


class CostPredictionResponse(BaseModel):
    estimated_cost: float


class UnifiedPredictionResponse(BaseModel):
    failure_prediction: int
    failure_probability: float
    estimated_cost: float


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    database: str


class PredictionItem(BaseModel):
    prediction_id: int
    request_id: Optional[str] = None
    created_at: Optional[datetime] = None
    machine_type: Optional[str] = None
    air_temperature: Optional[float] = None
    process_temperature: Optional[float] = None
    rotational_speed: Optional[float] = None
    torque: Optional[float] = None
    tool_wear: Optional[float] = None
    failure_prediction: Optional[int] = None
    failure_probability: Optional[float] = None
    predicted_cost: Optional[float] = None


class PaginatedPredictionsResponse(BaseModel):
    total: int
    limit: int
    offset: int
    items: List[PredictionItem]


class DashboardSummary(BaseModel):
    total_machines: int
    total_failures: int
    failure_rate_pct: float
    total_maintenance_cost: float
    total_downtime_hours: float


class FailureByTypeItem(BaseModel):
    machine_type: str
    failure_count: int
    avg_cost: float
    avg_downtime_hours: float


class FailureCauseItem(BaseModel):
    cause: str
    count: int


class TopRiskMachineItem(BaseModel):
    product_id: str
    machine_type: str
    tool_wear: float
    wear_rank: int


class PredictionsSummary(BaseModel):
    total_predictions: int
    predicted_failures: int
    avg_failure_probability: float
    avg_predicted_cost: float

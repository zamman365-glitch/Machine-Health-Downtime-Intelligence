from typing import List
from fastapi import APIRouter, Query, HTTPException
from app.schemas import (
    DashboardSummary,
    FailureByTypeItem,
    FailureCauseItem,
    TopRiskMachineItem,
    PredictionsSummary,
)
from app.db import run_query

router = APIRouter(prefix="/dashboard", tags=["Dashboard Analytics"])


@router.get("/summary", response_model=DashboardSummary, summary="Get overall machine maintenance KPI summary")
def get_dashboard_summary():
    try:
        query = """
            SELECT
                COUNT(DISTINCT m.machine_id) AS total_machines,
                COALESCE(SUM(CASE WHEN ml.machine_failure THEN 1 ELSE 0 END), 0) AS total_failures,
                ROUND(
                    COALESCE(100.0 * SUM(CASE WHEN ml.machine_failure THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT m.machine_id), 0), 0.0),
                    2
                ) AS failure_rate_pct,
                ROUND(COALESCE(SUM(ml.maintenance_cost), 0.0), 2) AS total_maintenance_cost,
                ROUND(COALESCE(SUM(ml.downtime_hours), 0.0), 2) AS total_downtime_hours
            FROM machines m
            LEFT JOIN maintenance_log ml ON ml.machine_id = m.machine_id;
        """
        row = run_query(query, fetch_one=True)
        if not row:
            return DashboardSummary(
                total_machines=0,
                total_failures=0,
                failure_rate_pct=0.0,
                total_maintenance_cost=0.0,
                total_downtime_hours=0.0,
            )

        return DashboardSummary(
            total_machines=int(row[0] or 0),
            total_failures=int(row[1] or 0),
            failure_rate_pct=float(row[2] or 0.0),
            total_maintenance_cost=float(row[3] or 0.0),
            total_downtime_hours=float(row[4] or 0.0),
        )
    except Exception:
        return DashboardSummary(
            total_machines=0,
            total_failures=0,
            failure_rate_pct=0.0,
            total_maintenance_cost=0.0,
            total_downtime_hours=0.0,
        )


@router.get("/failure-by-type", response_model=List[FailureByTypeItem], summary="Get failure statistics grouped by machine type")
def get_failure_by_type():
    try:
        query = """
            SELECT
                m.machine_type,
                COUNT(CASE WHEN ml.machine_failure THEN 1 END) AS failure_count,
                ROUND(COALESCE(AVG(ml.maintenance_cost), 0.0), 2) AS avg_cost,
                ROUND(COALESCE(AVG(ml.downtime_hours), 0.0), 2) AS avg_downtime_hours
            FROM machines m
            LEFT JOIN maintenance_log ml ON ml.machine_id = m.machine_id
            GROUP BY m.machine_type
            ORDER BY m.machine_type;
        """
        rows = run_query(query, fetch_all=True) or []
        return [
            FailureByTypeItem(
                machine_type=r[0],
                failure_count=int(r[1] or 0),
                avg_cost=float(r[2] or 0.0),
                avg_downtime_hours=float(r[3] or 0.0),
            )
            for r in rows
        ]
    except Exception:
        return []


@router.get("/failure-causes", response_model=List[FailureCauseItem], summary="Get failure breakdown by root cause")
def get_failure_causes():
    try:
        query = """
            SELECT
                COALESCE(SUM(CASE WHEN twf THEN 1 ELSE 0 END), 0) AS twf_count,
                COALESCE(SUM(CASE WHEN hdf THEN 1 ELSE 0 END), 0) AS hdf_count,
                COALESCE(SUM(CASE WHEN pwf THEN 1 ELSE 0 END), 0) AS pwf_count,
                COALESCE(SUM(CASE WHEN osf THEN 1 ELSE 0 END), 0) AS osf_count,
                COALESCE(SUM(CASE WHEN rnf THEN 1 ELSE 0 END), 0) AS rnf_count
            FROM maintenance_log;
        """
        row = run_query(query, fetch_one=True)
        if not row:
            return []

        causes = [
            ("Tool Wear Failure (TWF)", int(row[0] or 0)),
            ("Heat Dissipation Failure (HDF)", int(row[1] or 0)),
            ("Power Failure (PWF)", int(row[2] or 0)),
            ("Overstrain Failure (OSF)", int(row[3] or 0)),
            ("Random Failure (RNF)", int(row[4] or 0)),
        ]
        return [FailureCauseItem(cause=c[0], count=c[1]) for c in causes]
    except Exception:
        return []


@router.get("/top-risk-machines", response_model=List[TopRiskMachineItem], summary="Get top machines ranked by tool wear")
def get_top_risk_machines(limit: int = Query(10, ge=1, le=50)):
    try:
        query = """
            SELECT
                m.product_id,
                m.machine_type,
                COALESCE(sr.tool_wear, 0.0) AS tool_wear,
                RANK() OVER (ORDER BY COALESCE(sr.tool_wear, 0) DESC) AS wear_rank
            FROM machines m
            LEFT JOIN sensor_readings sr ON sr.machine_id = m.machine_id
            ORDER BY tool_wear DESC
            LIMIT %s;
        """
        rows = run_query(query, (limit,), fetch_all=True) or []
        return [
            TopRiskMachineItem(
                product_id=r[0],
                machine_type=r[1],
                tool_wear=float(r[2] or 0.0),
                wear_rank=int(r[3] or idx + 1),
            )
            for idx, r in enumerate(rows)
        ]
    except Exception:
        return []


@router.get("/predictions/summary", response_model=PredictionsSummary, summary="Get predictions table summary metrics")
def get_predictions_summary():
    try:
        query = """
            SELECT
                COUNT(*) AS total_predictions,
                COALESCE(SUM(CASE WHEN failure_prediction IS TRUE THEN 1 ELSE 0 END), 0) AS predicted_failures,
                ROUND(COALESCE(AVG(failure_probability), 0.0), 4) AS avg_failure_probability,
                ROUND(COALESCE(AVG(predicted_cost), 0.0), 2) AS avg_predicted_cost
            FROM predictions;
        """
        row = run_query(query, fetch_one=True)
        if not row:
            return PredictionsSummary(
                total_predictions=0,
                predicted_failures=0,
                avg_failure_probability=0.0,
                avg_predicted_cost=0.0,
            )

        return PredictionsSummary(
            total_predictions=int(row[0] or 0),
            predicted_failures=int(row[1] or 0),
            avg_failure_probability=float(row[2] or 0.0),
            avg_predicted_cost=float(row[3] or 0.0),
        )
    except Exception:
        return PredictionsSummary(
            total_predictions=0,
            predicted_failures=0,
            avg_failure_probability=0.0,
            avg_predicted_cost=0.0,
        )

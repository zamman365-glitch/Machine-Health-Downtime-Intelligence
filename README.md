# Machine Health & Predictive Maintenance Intelligence Platform

A production-ready FastAPI backend service and React dashboard for predictive machine maintenance, failure probability calculation, and maintenance cost estimation.

---

## Technical Architecture

```
app/
  main.py              # FastAPI app creation, CORS, logging middleware, router includes
  config.py            # Pydantic Settings module loading sql/.env with defaults
  db.py                # ThreadedConnectionPool, query runner, insert runner, DB health check
  schemas.py           # Pydantic input models (with gt=0, tool_wear>=0) & API response DTOs
  services/
    model_loader.py    # Pathlib-based safe joblib loader
    features.py        # Feature engineering (Type encoding, Temp Diff, Avg Temp, Power)
    prediction.py      # Inference logic for failure, cost, & combined predictions
  routers/
    predict.py         # POST /predict/failure, POST /predict/cost, POST /predict, GET /predictions
    dashboard.py       # GET /dashboard/summary, failure-by-type, failure-causes, top-risk-machines, predictions/summary
    health.py          # GET /health, GET /
sql/
  migrations/
    001_predictions_upgrade.sql # Non-destructive schema migration
tests/                 # Pytest test suite for validation, features, predictions, and health
```

---

## API Endpoints Table

| Method | Endpoint | Description | Response Model |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root API health status | `{"message": "Machine Health API is running"}` |
| `GET` | `/health` | System health check (models & DB) | `{"status": "ok", "model_loaded": true, "database": "ok"}` |
| `POST` | `/predict/failure` | Legacy failure risk endpoint | `{"failure_prediction": 0, "failure_probability": 0.01}` |
| `POST` | `/predict/cost` | Legacy maintenance cost endpoint | `{"estimated_cost": 1037.95}` |
| `POST` | `/predict` | Unified single-row failure + cost prediction | `{"failure_prediction": 0, "failure_probability": 0.01, "estimated_cost": 1037.95}` |
| `GET` | `/predictions` | Paginated prediction logs history | `{"total": 10, "items": [...]}` |
| `GET` | `/dashboard/summary` | Overall KPI summary | `{"total_machines": 10000, "total_failures": 339, ...}` |
| `GET | `/dashboard/failure-by-type` | Failures grouped by machine type (L, M, H) | `[{"machine_type": "L", "failure_count": 235, ...}]` |
| `GET` | `/dashboard/failure-causes` | Breakdown by failure cause | `[{"cause": "Tool Wear Failure", "count": 45}]` |
| `GET` | `/dashboard/top-risk-machines` | Machines ranked by tool wear | `[{"product_id": "L47180", "tool_wear": 250.0}]` |
| `GET` | `/dashboard/predictions/summary` | Predictions table summary statistics | `{"total_predictions": 15, "predicted_failures": 1, ...}` |

---

## Database Migration

The non-destructive migration script is located at `sql/migrations/001_predictions_upgrade.sql`.

To apply it manually via PostgreSQL client or python:
```sql
ALTER TABLE predictions 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS machine_type CHAR(1),
    ADD COLUMN IF NOT EXISTS air_temperature NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS process_temperature NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS rotational_speed NUMERIC(8,2),
    ADD COLUMN IF NOT EXISTS torque NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS tool_wear NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS request_id UUID;

CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions (created_at DESC);
```

---

## Running the Backend & Tests

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the FastAPI server**:
   ```bash
   uvicorn app:app --reload --host 127.0.0.1 --port 8000
   ```
   Or using the modular path:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

3. **Interactive API Documentation (Swagger)**:
   Open `http://127.0.0.1:8000/docs` in your browser.

4. **Run Test Suite**:
   ```bash
   pytest
   ```

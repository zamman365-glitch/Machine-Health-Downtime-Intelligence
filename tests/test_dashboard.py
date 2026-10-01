from unittest.mock import patch

def test_dashboard_summary_empty_db(client):
    with patch("app.routers.dashboard.run_query", return_value=None):
        res = client.get("/dashboard/summary")
        assert res.status_code == 200
        data = res.json()
        assert data["total_machines"] == 0
        assert data["total_failures"] == 0
        assert data["failure_rate_pct"] == 0.0

def test_dashboard_failure_by_type_empty_db(client):
    with patch("app.routers.dashboard.run_query", return_value=[]):
        res = client.get("/dashboard/failure-by-type")
        assert res.status_code == 200
        assert res.json() == []

def test_dashboard_failure_causes_empty_db(client):
    with patch("app.routers.dashboard.run_query", return_value=None):
        res = client.get("/dashboard/failure-causes")
        assert res.status_code == 200
        assert res.json() == []

def test_dashboard_predictions_summary(client):
    with patch("app.routers.dashboard.run_query", return_value=(10, 2, 0.15, 1250.50)):
        res = client.get("/dashboard/predictions/summary")
        assert res.status_code == 200
        data = res.json()
        assert data["total_predictions"] == 10
        assert data["predicted_failures"] == 2
        assert data["avg_failure_probability"] == 0.15
        assert data["avg_predicted_cost"] == 1250.50

from unittest.mock import patch

def test_home_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json() == {"message": "Machine Health API is running"}

def test_health_check_db_online(client):
    with patch("app.routers.health.check_db_health", return_value=True):
        res = client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"
        assert data["model_loaded"] is True
        assert data["database"] == "ok"

def test_health_check_db_offline(client):
    with patch("app.routers.health.check_db_health", return_value=False):
        res = client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "degraded"
        assert data["database"] == "down"

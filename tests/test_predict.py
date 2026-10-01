from unittest.mock import patch

def test_predict_failure_endpoint(client):
    payload = {
        "type": "M",
        "air_temperature": 298.1,
        "process_temperature": 308.6,
        "rotational_speed": 1551.0,
        "torque": 42.8,
        "tool_wear": 180.0
    }
    with patch("app.services.prediction.run_insert"):
        res = client.post("/predict/failure", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "failure_prediction" in data
        assert "failure_probability" in data
        assert isinstance(data["failure_prediction"], int)
        assert isinstance(data["failure_probability"], float)

def test_predict_cost_endpoint(client):
    payload = {
        "type": "M",
        "air_temperature": 298.1,
        "process_temperature": 308.6,
        "rotational_speed": 1551.0,
        "torque": 42.8,
        "tool_wear": 180.0
    }
    with patch("app.services.prediction.run_insert"):
        res = client.post("/predict/cost", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "estimated_cost" in data
        assert isinstance(data["estimated_cost"], float)

def test_unified_predict_endpoint(client):
    payload = {
        "type": "M",
        "air_temperature": 298.1,
        "process_temperature": 308.6,
        "rotational_speed": 1551.0,
        "torque": 42.8,
        "tool_wear": 180.0
    }
    with patch("app.services.prediction.run_insert") as mock_insert:
        res = client.post("/predict", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "failure_prediction" in data
        assert "failure_probability" in data
        assert "estimated_cost" in data
        assert mock_insert.call_count == 1

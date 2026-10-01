from app.schemas import MachineInput
from app.services.features import build_features, FEATURE_COLUMNS

def test_build_features_known_input():
    input_data = MachineInput(
        type="M",
        air_temperature=298.0,
        process_temperature=308.0,
        rotational_speed=1500.0,
        torque=40.0,
        tool_wear=100.0
    )
    df = build_features(input_data)
    
    assert list(df.columns) == FEATURE_COLUMNS
    assert df.loc[0, "Air temperature [K]"] == 298.0
    assert df.loc[0, "Process temperature [K]"] == 308.0
    assert df.loc[0, "Temperature difference"] == 10.0
    assert df.loc[0, "Average Temperature"] == 303.0
    assert df.loc[0, "Power"] == 60000.0

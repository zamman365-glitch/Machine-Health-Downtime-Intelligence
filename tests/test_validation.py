import pytest
from app.schemas import MachineInput
from pydantic import ValidationError

def test_valid_machine_input():
    input_data = MachineInput(
        type="M",
        air_temperature=298.1,
        process_temperature=308.6,
        rotational_speed=1551.0,
        torque=42.8,
        tool_wear=180.0
    )
    assert input_data.type == "M"
    assert input_data.air_temperature == 298.1
    assert input_data.process_temperature == 308.6

def test_invalid_temperature_bounds():
    with pytest.raises(ValidationError):
        MachineInput(
            type="M",
            air_temperature=-10.0,
            process_temperature=308.6,
            rotational_speed=1551.0,
            torque=42.8,
            tool_wear=180.0
        )

def test_process_temp_lower_than_air_temp():
    with pytest.raises(ValidationError):
        MachineInput(
            type="M",
            air_temperature=305.0,
            process_temperature=295.0,
            rotational_speed=1551.0,
            torque=42.8,
            tool_wear=180.0
        )

def test_tool_wear_negative():
    with pytest.raises(ValidationError):
        MachineInput(
            type="M",
            air_temperature=298.1,
            process_temperature=308.6,
            rotational_speed=1551.0,
            torque=42.8,
            tool_wear=-5.0
        )

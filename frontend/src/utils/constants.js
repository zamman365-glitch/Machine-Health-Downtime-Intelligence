// Global Application Constants & Defaults

export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
export const CURRENCY = import.meta.env.VITE_CURRENCY || "INR";
export const LOCALE = import.meta.env.VITE_LOCALE || "en-IN";

export const RISK_THRESHOLDS = {
  LOW: 0.30,   // Failure probability < 30% -> Low Risk
  MEDIUM: 0.60  // Failure probability 30% - 60% -> Medium Risk, > 60% -> High Risk
};

export const TYPICAL_RANGES = {
  air_temperature: { min: 295, max: 304, label: "Air Temperature", unit: "K" },
  process_temperature: { min: 305, max: 314, label: "Process Temperature", unit: "K" },
  rotational_speed: { min: 1100, max: 2900, label: "Rotational Speed", unit: "rpm" },
  torque: { min: 3, max: 77, label: "Torque", unit: "Nm" },
  tool_wear: { min: 0, max: 255, label: "Tool Wear", unit: "min" }
};

export const PRESETS = [
  {
    id: "normal",
    label: "Normal operation",
    values: {
      type: "M",
      air_temperature: 298.1,
      process_temperature: 308.6,
      rotational_speed: 1551,
      torque: 42.8,
      tool_wear: 180
    }
  },
  {
    id: "high_wear",
    label: "High tool wear",
    values: {
      type: "H",
      air_temperature: 300.2,
      process_temperature: 310.5,
      rotational_speed: 1420,
      torque: 52.4,
      tool_wear: 245
    }
  },
  {
    id: "overload",
    label: "High torque / overload",
    values: {
      type: "L",
      air_temperature: 298.5,
      process_temperature: 309.2,
      rotational_speed: 2750,
      torque: 76.5,
      tool_wear: 135
    }
  }
];

import React, { useState } from "react";
import { Sliders, RotateCcw, Play, Loader2 } from "lucide-react";
import { TypeSegmentedControl } from "./TypeSegmentedControl";
import { NumberField } from "./NumberField";
import { PRESETS } from "../utils/constants";
import { validateField, validateForm, getSoftWarning } from "../utils/validation";

/**
 * PredictionForm component for entering machine parameters
 */
export function PredictionForm({ onSubmit, isLoading, onLiveChange }) {
  const [formData, setFormData] = useState({
    type: "M",
    air_temperature: "298.1",
    process_temperature: "308.6",
    rotational_speed: "1551",
    torque: "42.8",
    tool_wear: "180",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    if (touched[field]) {
      const fieldErr = validateField(field, value, nextData);
      setErrors((prev) => ({ ...prev, [field]: fieldErr }));
    }

    if (onLiveChange) {
      onLiveChange(nextData);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErr = validateField(field, formData[field], formData);
    setErrors((prev) => ({ ...prev, [field]: fieldErr }));
  };

  const handleLoadPreset = (e) => {
    const presetId = e.target.value;
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const stringifiedValues = {
        type: preset.values.type,
        air_temperature: String(preset.values.air_temperature),
        process_temperature: String(preset.values.process_temperature),
        rotational_speed: String(preset.values.rotational_speed),
        torque: String(preset.values.torque),
        tool_wear: String(preset.values.tool_wear),
      };
      setFormData(stringifiedValues);
      setErrors({});
      setTouched({});
      if (onLiveChange) onLiveChange(stringifiedValues);
    }
    e.target.value = "";
  };

  const handleReset = () => {
    const defaultData = {
      type: "M",
      air_temperature: "298.1",
      process_temperature: "308.6",
      rotational_speed: "1551",
      torque: "42.8",
      tool_wear: "180",
    };
    setFormData(defaultData);
    setErrors({});
    setTouched({});
    if (onLiveChange) onLiveChange(defaultData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all fields for error display
    const allTouched = {
      type: true,
      air_temperature: true,
      process_temperature: true,
      rotational_speed: true,
      torque: true,
      tool_wear: true,
    };
    setTouched(allTouched);

    const validation = validateForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    // Convert string inputs to parsed numbers for API request body
    const numericPayload = {
      type: formData.type,
      air_temperature: parseFloat(formData.air_temperature),
      process_temperature: parseFloat(formData.process_temperature),
      rotational_speed: parseFloat(formData.rotational_speed),
      torque: parseFloat(formData.torque),
      tool_wear: parseFloat(formData.tool_wear),
    };

    onSubmit(numericPayload);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-500" />
          Machine Parameters
        </h2>

        {/* Load Sample Dropdown */}
        <select
          onChange={handleLoadPreset}
          defaultValue=""
          className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Load sample presets"
        >
          <option value="" disabled>
            Load sample...
          </option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TypeSegmentedControl
          value={formData.type}
          onChange={(val) => handleChange("type", val)}
          error={errors.type}
        />

        <NumberField
          id="air_temperature"
          label="Air Temperature"
          unit="K"
          value={formData.air_temperature}
          onChange={(val) => handleChange("air_temperature", val)}
          onBlur={() => handleBlur("air_temperature")}
          step="0.1"
          placeholder="298.1"
          helperText="Typical range: 295–304 K"
          error={errors.air_temperature}
          warning={getSoftWarning("air_temperature", formData.air_temperature)}
        />

        <NumberField
          id="process_temperature"
          label="Process Temperature"
          unit="K"
          value={formData.process_temperature}
          onChange={(val) => handleChange("process_temperature", val)}
          onBlur={() => handleBlur("process_temperature")}
          step="0.1"
          placeholder="308.6"
          helperText="Typical range: 305–314 K (Must be > Air Temp)"
          error={errors.process_temperature}
          warning={getSoftWarning("process_temperature", formData.process_temperature)}
        />

        <NumberField
          id="rotational_speed"
          label="Rotational Speed"
          unit="rpm"
          value={formData.rotational_speed}
          onChange={(val) => handleChange("rotational_speed", val)}
          onBlur={() => handleBlur("rotational_speed")}
          step="1"
          placeholder="1551"
          helperText="Typical range: 1100–2900 rpm"
          error={errors.rotational_speed}
          warning={getSoftWarning("rotational_speed", formData.rotational_speed)}
        />

        <NumberField
          id="torque"
          label="Torque"
          unit="Nm"
          value={formData.torque}
          onChange={(val) => handleChange("torque", val)}
          onBlur={() => handleBlur("torque")}
          step="0.1"
          placeholder="42.8"
          helperText="Typical range: 3–77 Nm"
          error={errors.torque}
          warning={getSoftWarning("torque", formData.torque)}
        />

        <NumberField
          id="tool_wear"
          label="Tool Wear"
          unit="min"
          value={formData.tool_wear}
          onChange={(val) => handleChange("tool_wear", val)}
          onBlur={() => handleBlur("tool_wear")}
          step="1"
          placeholder="180"
          helperText="Typical range: 0–255 min"
          error={errors.tool_wear}
          warning={getSoftWarning("tool_wear", formData.tool_wear)}
        />

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm rounded-lg shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running prediction...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run prediction</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

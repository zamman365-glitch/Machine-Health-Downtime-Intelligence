import { TYPICAL_RANGES } from "./constants";

/**
 * Validate a single field
 * @param {string} name 
 * @param {any} value 
 * @param {object} allValues 
 * @returns {string|null} Error string or null
 */
export function validateField(name, value, allValues = {}) {
  if (value === "" || value === null || value === undefined) {
    return "This field is required.";
  }

  if (name === "type") {
    if (!["L", "M", "H"].includes(value)) {
      return "Product type must be L, M, or H.";
    }
    return null;
  }

  const num = Number(value);
  if (isNaN(num)) {
    return "Value must be a valid number.";
  }

  if (name === "tool_wear") {
    if (num < 0) return "Tool wear cannot be negative.";
  } else {
    if (num <= 0) return "Value must be greater than 0.";
  }

  if (name === "process_temperature") {
    const airTemp = Number(allValues.air_temperature);
    if (!isNaN(airTemp) && num <= airTemp) {
      return "Process temperature must be greater than Air temperature.";
    }
  }

  if (name === "air_temperature") {
    const procTemp = Number(allValues.process_temperature);
    if (!isNaN(procTemp) && procTemp <= num) {
      // Return cross-field hint if process temp exists
      return null;
    }
  }

  return null;
}

/**
 * Validate all form values
 * @param {object} values 
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateForm(values) {
  const errors = {};
  const fields = ["type", "air_temperature", "process_temperature", "rotational_speed", "torque", "tool_wear"];

  fields.forEach(field => {
    const err = validateField(field, values[field], values);
    if (err) errors[field] = err;
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Get soft range warning message (non-blocking)
 * @param {string} name 
 * @param {number|string} value 
 * @returns {string|null} Warning message or null
 */
export function getSoftWarning(name, value) {
  const range = TYPICAL_RANGES[name];
  if (!range || value === "" || value === null || value === undefined) return null;

  const num = Number(value);
  if (isNaN(num)) return null;

  if (num < range.min || num > range.max) {
    return `Outside typical range (${range.min}–${range.max} ${range.unit})`;
  }

  return null;
}

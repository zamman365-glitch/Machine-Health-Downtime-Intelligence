import { describe, it, expect } from 'vitest';
import { validateField, validateForm, getSoftWarning } from '../validation';

describe('validation utilities', () => {
  it('validates required fields', () => {
    expect(validateField('air_temperature', '')).toBe('This field is required.');
    expect(validateField('air_temperature', null)).toBe('This field is required.');
  });

  it('validates numeric constraints', () => {
    expect(validateField('air_temperature', 'abc')).toBe('Value must be a valid number.');
    expect(validateField('air_temperature', '0')).toBe('Value must be greater than 0.');
    expect(validateField('air_temperature', '-10')).toBe('Value must be greater than 0.');
  });

  it('validates process temperature > air temperature constraint', () => {
    const err = validateField('process_temperature', '290.0', { air_temperature: '298.1' });
    expect(err).toBe('Process temperature must be greater than Air temperature.');

    const validErr = validateField('process_temperature', '308.6', { air_temperature: '298.1' });
    expect(validErr).toBeNull();
  });

  it('validates entire form', () => {
    const invalidValues = {
      type: 'M',
      air_temperature: 298.1,
      process_temperature: 290.0,
      rotational_speed: 1500,
      torque: 40,
      tool_wear: 100
    };

    const res = validateForm(invalidValues);
    expect(res.isValid).toBe(false);
    expect(res.errors.process_temperature).toBe('Process temperature must be greater than Air temperature.');
  });

  it('generates soft range warnings when out of typical range', () => {
    expect(getSoftWarning('air_temperature', 310)).toContain('Outside typical range');
    expect(getSoftWarning('air_temperature', 298.1)).toBeNull();
  });
});

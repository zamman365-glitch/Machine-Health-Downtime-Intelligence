import { describe, it, expect } from 'vitest';
import { getRiskLevel } from '../riskLevel';

describe('riskLevel utility', () => {
  it('categorizes probability < 0.3 as Low Risk', () => {
    const risk = getRiskLevel(0.15);
    expect(risk.level).toBe('Low Risk');
    expect(risk.levelCode).toBe('low');
    expect(risk.color).toBe('#10b981');
  });

  it('categorizes probability between 0.3 and 0.6 as Medium Risk', () => {
    const risk = getRiskLevel(0.45);
    expect(risk.level).toBe('Medium Risk');
    expect(risk.levelCode).toBe('medium');
    expect(risk.color).toBe('#f59e0b');
  });

  it('categorizes probability > 0.6 as High Risk', () => {
    const risk = getRiskLevel(0.85);
    expect(risk.level).toBe('High Risk');
    expect(risk.levelCode).toBe('high');
    expect(risk.color).toBe('#ef4444');
  });
});

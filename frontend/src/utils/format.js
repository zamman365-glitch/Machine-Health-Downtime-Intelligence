import { CURRENCY, LOCALE } from "./constants";

/**
 * Format currency amount with locale and currency
 */
export function formatCurrency(amount, currencyCode = CURRENCY, localeCode = LOCALE) {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0.00";

  try {
    return new Intl.NumberFormat(localeCode, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    return `₹${amount.toFixed(2)}`;
  }
}

/**
 * Format numbers with decimal precision
 */
export function formatNumber(val, decimals = 1) {
  const num = Number(val);
  if (isNaN(num)) return "0";
  return num.toFixed(decimals);
}

/**
 * Format ISO timestamp into human readable time string
 */
export function formatTime(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (e) {
    return isoString;
  }
}

/**
 * Calculate client-side derived metrics
 */
export function calculateDerivedMetrics(airTemp, procTemp, speed, torque) {
  const air = Number(airTemp) || 0;
  const proc = Number(procTemp) || 0;
  const rpm = Number(speed) || 0;
  const trq = Number(torque) || 0;

  const tempDiff = proc - air;
  const avgTemp = (proc + air) / 2;
  const power = rpm * trq;

  return {
    tempDiff: tempDiff.toFixed(2),
    avgTemp: avgTemp.toFixed(2),
    power: power.toFixed(1)
  };
}

import { RISK_THRESHOLDS } from "./constants";

/**
 * Get risk details from probability (0.0 to 1.0)
 * @param {number} probability 
 * @returns {object} { level, levelCode, badgeClass, color, recommendation }
 */
export function getRiskLevel(probability) {
  const prob = Number(probability) || 0;

  if (prob < RISK_THRESHOLDS.LOW) {
    return {
      level: "Low Risk",
      levelCode: "low",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      color: "#10b981",
      recommendation: "Machine parameters are within healthy operating limits. Standard routine maintenance recommended."
    };
  } else if (prob <= RISK_THRESHOLDS.MEDIUM) {
    return {
      level: "Medium Risk",
      levelCode: "medium",
      badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      color: "#f59e0b",
      recommendation: "Elevated risk detected. Schedule inspection during the next planned downtime window and check tool wear."
    };
  } else {
    return {
      level: "High Risk",
      levelCode: "high",
      badgeClass: "bg-red-500/15 text-red-400 border-red-500/30",
      color: "#ef4444",
      recommendation: "Critical failure risk! Immediate machine shutdown and overhaul inspection advised to prevent breakdown."
    };
  }
}

import React from "react";
import { calculateDerivedMetrics } from "../utils/format";

/**
 * DerivedMetrics component for client-side calculated parameters
 */
export function DerivedMetrics({ airTemperature, processTemperature, rotationalSpeed, torque }) {
  const metrics = calculateDerivedMetrics(
    airTemperature,
    processTemperature,
    rotationalSpeed,
    torque
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-sm">
      <div className="space-y-0.5">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Temp Difference</span>
        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{metrics.tempDiff} K</div>
      </div>

      <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-700/50 pt-2 sm:pt-0 sm:pl-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Temp</span>
        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{metrics.avgTemp} K</div>
      </div>

      <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-700/50 pt-2 sm:pt-0 sm:pl-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Calculated Power</span>
        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{metrics.power} W</div>
      </div>
    </div>
  );
}

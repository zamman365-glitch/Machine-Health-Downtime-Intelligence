import React from "react";
import { Info } from "lucide-react";
import { getRiskLevel } from "../utils/riskLevel";

/**
 * Recommendation component
 */
export function Recommendation({ probability }) {
  const hasResult = probability !== undefined && probability !== null;
  const risk = getRiskLevel(hasResult ? probability : 0);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-sm flex items-start gap-3">
      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
          Recommendation
        </h4>
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          {hasResult
            ? risk.recommendation
            : 'Enter machine parameters and click "Run prediction" to analyze failure risk and cost estimates.'}
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { RiskGauge } from "./RiskGauge";
import { Skeleton } from "./Skeleton";
import { getRiskLevel } from "../utils/riskLevel";

/**
 * FailureCard component
 */
export function FailureCard({ result, isLoading, isRetrying, error, onRetry }) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm min-h-[220px]">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Failure Risk
        </div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 rounded-xl p-5 shadow-sm min-h-[220px] flex flex-col items-center justify-center text-center gap-3">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Failure Call Failed</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">{error}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
          <span>Retry Failure Call</span>
        </button>
      </div>
    );
  }

  const probPercent = result ? result.failure_probability * 100 : 0;
  const risk = getRiskLevel(result ? result.failure_probability : 0);
  const isFailure = result ? result.failure_prediction === 1 : false;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm min-h-[220px] flex flex-col justify-between">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Failure Risk
      </div>

      <div className="flex flex-col items-center my-2">
        <RiskGauge percentage={probPercent} color={risk.color} />
        <span
          className={`mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${risk.badgeClass}`}
        >
          {risk.level}
        </span>
      </div>

      <div className="text-center pt-1 border-t border-slate-100 dark:border-slate-700/50">
        <span
          className={`text-xs font-semibold ${
            isFailure ? "text-red-500" : "text-emerald-500"
          }`}
        >
          {result ? (isFailure ? "Failure predicted" : "No failure predicted") : "No prediction yet"}
        </span>
      </div>
    </div>
  );
}

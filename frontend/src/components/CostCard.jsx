import { AlertTriangle, RefreshCw } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { formatCurrency } from "../utils/format";

/**
 * CostCard component
 */
export function CostCard({ result, isLoading, isRetrying, error, onRetry }) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm min-h-[220px]">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Estimated Maintenance Cost
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
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Cost Call Failed</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">{error}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
          <span>Retry Cost Call</span>
        </button>
      </div>
    );
  }

  const cost = result ? result.estimated_cost : 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm min-h-[220px] flex flex-col justify-between">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Estimated Maintenance Cost
      </div>

      <div className="my-auto py-2">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {formatCurrency(cost)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Model-estimated repair &amp; overhaul expense for current operational parameters.
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 text-right">
        <span className="text-[11px] font-mono text-slate-400">Currency: INR (en-IN)</span>
      </div>
    </div>
  );
}

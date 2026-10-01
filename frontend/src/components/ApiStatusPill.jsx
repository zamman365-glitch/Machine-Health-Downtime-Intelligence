import React from "react";

/**
 * ApiStatusPill component showing live API health indicator
 * @param {{ isOnline: boolean, isChecking: boolean }} props
 */
export function ApiStatusPill({ isOnline, isChecking }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
      aria-live="polite"
    >
      <span
        className={`w-2.5 h-2.5 rounded-full transition-all ${
          isOnline
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
        }`}
      />
      <span className="text-slate-700 dark:text-slate-300">
        {isChecking ? "Checking API..." : isOnline ? "API online" : "API offline"}
      </span>
    </div>
  );
}

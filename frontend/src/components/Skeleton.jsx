import React from "react";

/**
 * Skeleton component for card loading states
 */
export function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 py-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-1/3"></div>
      <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700/60 mx-auto"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-700/60 rounded w-3/4 mx-auto"></div>
    </div>
  );
}

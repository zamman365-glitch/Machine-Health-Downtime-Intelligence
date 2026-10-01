import React from "react";
import { Activity } from "lucide-react";
import { ApiStatusPill } from "./ApiStatusPill";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Header component
 */
export function Header({ isOnline, isChecking, theme, onToggleTheme }) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Predictive Maintenance Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Machine failure risk and maintenance cost estimation
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        <ApiStatusPill isOnline={isOnline} isChecking={isChecking} />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

import React from "react";
import { Download, Trash2, Clock, Inbox } from "lucide-react";
import { formatTime, formatCurrency } from "../utils/format";
import { getRiskLevel } from "../utils/riskLevel";
import { exportToCsv } from "../utils/csv";

/**
 * HistoryTable component
 */
export function HistoryTable({ history = [], onClearHistory, onShowToast }) {
  const handleExport = () => {
    if (!history || history.length === 0) {
      if (onShowToast) onShowToast("No prediction history available to export.", "warning");
      return;
    }
    const success = exportToCsv(history);
    if (success && onShowToast) {
      onShowToast("Prediction history exported to CSV!", "success");
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all prediction history?")) {
      onClearHistory();
      if (onShowToast) onShowToast("Prediction history cleared.", "info");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm space-y-4 mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60 gap-3">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          Prediction History &amp; Trends
        </h2>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleExport}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-10 text-center text-slate-400 space-y-2">
          <Inbox className="w-10 h-10 mx-auto opacity-40" />
          <p className="text-sm">No prediction history yet. Run a prediction to record entries.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-100 dark:border-slate-700/50 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700/60">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Time</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Type</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Inputs Summary</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Risk %</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Verdict</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Est. Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-200">
              {history.map((item, idx) => {
                const risk = getRiskLevel(item.failure_probability);
                const isFailure = item.failure_prediction === 1;

                return (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-500">
                      {formatTime(item.timestamp)}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 font-bold rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        {item.type}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-3 max-w-[260px] truncate text-slate-500 dark:text-slate-400"
                      title={`Air: ${item.air_temperature}K, Proc: ${item.process_temperature}K, Speed: ${item.rotational_speed}rpm, Torque: ${item.torque}Nm, Wear: ${item.tool_wear}m`}
                    >
                      Air: {item.air_temperature}K | Proc: {item.process_temperature}K | {item.rotational_speed}rpm
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold border ${risk.badgeClass}`}
                      >
                        {(item.failure_probability * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-semibold">
                      <span className={isFailure ? "text-red-500" : "text-emerald-500"}>
                        {isFailure ? "Failure" : "Normal"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-semibold">
                      {item.estimated_cost ? formatCurrency(item.estimated_cost) : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

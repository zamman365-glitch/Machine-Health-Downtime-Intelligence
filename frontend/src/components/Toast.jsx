import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Toast notification banner item
 */
export function ToastItem({ toast, onClose }) {
  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  };

  const borders = {
    error: "border-l-4 border-l-red-500",
    success: "border-l-4 border-l-emerald-500",
    warning: "border-l-4 border-l-amber-500",
    info: "border-l-4 border-l-blue-500",
  };

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl max-w-sm w-full transition-all animate-in fade-in slide-in-from-bottom-2 ${
        borders[toast.type] || borders.info
      }`}
      role="alert"
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
        {toast.message}
      </div>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * ToastContainer for rendering fixed toasts list
 */
export function ToastContainer({ toasts = [], onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="assertive"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

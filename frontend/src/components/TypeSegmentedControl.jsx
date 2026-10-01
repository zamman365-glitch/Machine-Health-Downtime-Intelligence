import React from "react";

/**
 * TypeSegmentedControl for selecting Product Quality Type (L, M, H)
 */
export function TypeSegmentedControl({ value, onChange, error }) {
  const options = [
    { id: "L", label: "L (Low)" },
    { id: "M", label: "M (Medium)" },
    { id: "H", label: "H (High)" },
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <label className="font-semibold text-slate-700 dark:text-slate-200">
          Product Quality Type
        </label>
        <span className="text-slate-400">Quality Spec</span>
      </div>

      <div
        className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 gap-1"
        role="radiogroup"
        aria-label="Product Quality Type"
      >
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.id)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

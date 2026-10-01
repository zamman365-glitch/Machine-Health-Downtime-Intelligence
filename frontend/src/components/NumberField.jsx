import React from "react";

/**
 * NumberField component for numeric parameters with soft warnings and error messages
 */
export function NumberField({
  id,
  label,
  unit,
  value,
  onChange,
  onBlur,
  step = "1",
  placeholder,
  helperText,
  error,
  warning,
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <label htmlFor={id} className="font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
        {unit && <span className="text-slate-400 font-mono">{unit}</span>}
      </div>

      <input
        type="number"
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        step={step}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 bg-red-50 dark:bg-red-950/20 focus:ring-red-500"
            : warning
            ? "border-amber-500/60 focus:ring-amber-500"
            : "border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500"
        }`}
      />

      {helperText && !error && !warning && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
      {warning && !error && (
        <p className="text-[11px] text-amber-500 dark:text-amber-400 font-medium">{warning}</p>
      )}
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

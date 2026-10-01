import React from "react";

/**
 * RiskGauge component rendering SVG radial progress ring
 * @param {{ percentage: number, color: string }} props
 */
export function RiskGauge({ percentage = 0, color = "#10b981" }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // ~326.72
  const clamped = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="stroke-slate-100 dark:stroke-slate-900 fill-none"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke={color}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatTime } from "../utils/format";

/**
 * Custom Tooltip for Recharts
 */
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg text-xs space-y-1">
        <p className="font-bold text-slate-900 dark:text-slate-100">{formatTime(data.timestamp)}</p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold">
          Risk: {(data.failure_probability * 100).toFixed(1)}%
        </p>
        <p className="text-slate-500">Verdict: {data.verdictText}</p>
        {data.formattedCost && <p className="text-slate-500">Cost: {data.formattedCost}</p>}
      </div>
    );
  }
  return null;
}

/**
 * RiskHistoryChart component powered by Recharts
 */
export function RiskHistoryChart({ history = [], theme = "dark" }) {
  if (!history || history.length === 0) return null;

  // Chronological order left-to-right
  const chartData = [...history].reverse().map((item, idx) => ({
    ...item,
    timeLabel: formatTime(item.timestamp) || `#${idx + 1}`,
    riskPercent: Number((item.failure_probability * 100).toFixed(1)),
  }));

  const isDark = theme === "dark";
  const strokeColor = "#3b82f6";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="w-full h-56 my-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="timeLabel"
            tick={{ fill: textColor, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: textColor, fontSize: 11 }}
            tickFormatter={(val) => `${val}%`}
            tickLine={false}
            axisLine={{ stroke: gridColor }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="riskPercent"
            stroke={strokeColor}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#riskGradient)"
            dot={{ r: 4, fill: strokeColor }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

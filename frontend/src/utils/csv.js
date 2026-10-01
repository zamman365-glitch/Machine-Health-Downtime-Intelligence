import { formatCurrency } from "./format";

/**
 * Download history array as CSV file
 * @param {Array} history 
 */
export function exportToCsv(history = []) {
  if (!history || history.length === 0) return false;

  const headers = [
    "Timestamp",
    "Quality Type",
    "Air Temp (K)",
    "Process Temp (K)",
    "Rotational Speed (rpm)",
    "Torque (Nm)",
    "Tool Wear (min)",
    "Failure Risk (%)",
    "Verdict",
    "Estimated Cost"
  ];

  const rows = history.map(item => [
    `"${item.timestamp || ''}"`,
    `"${item.type || ''}"`,
    item.air_temperature,
    item.process_temperature,
    item.rotational_speed,
    item.torque,
    item.tool_wear,
    (item.failure_probability * 100).toFixed(1) + "%",
    item.failure_prediction === 1 ? "Failure Predicted" : "No Failure",
    item.estimated_cost ? formatCurrency(item.estimated_cost) : "N/A"
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `predictive_maintenance_history_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

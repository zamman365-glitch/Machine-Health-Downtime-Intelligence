import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { PRESETS } from "../../utils/constants";
import { runParallelPredictions } from "../../api/machineApi";
import { formatCurrency } from "../../utils/format";
import { getRiskLevel } from "../../utils/riskLevel";

export function LiveDemoTeaser() {
  const [selectedPresetId, setSelectedPresetId] = useState("normal");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const selectedPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const handleRunDemo = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setResultData(null);

    const payload = selectedPreset.values;

    try {
      const results = await runParallelPredictions(payload);
      const { failure, cost } = results;

      if (failure.success || cost.success) {
        setResultData({
          failure: failure.success ? failure.data : null,
          cost: cost.success ? cost.data : null,
        });
      } else {
        setErrorMsg("Failed to connect to API endpoints. Ensure backend server is running on port 8000.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Unable to reach FastAPI backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const failureData = resultData?.failure;
  const costData = resultData?.cost;
  const risk = failureData ? getRiskLevel(failureData.failure_probability) : null;

  return (
    <section className="py-16 md:py-24 bg-slate-100/50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Interactive API Teaser
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Test Live Predictions Instantaneously
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Select a sample preset below and trigger real machine learning predictions directly from the FastAPI backend.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPresetId(p.id);
                  setResultData(null);
                  setErrorMsg(null);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                  selectedPresetId === p.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Selected Preset Details */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 text-xs grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-400 block">Quality Type</span>
              <span className="font-bold">{selectedPreset.values.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Air Temp</span>
              <span className="font-bold">{selectedPreset.values.air_temperature} K</span>
            </div>
            <div>
              <span className="text-slate-400 block">Process Temp</span>
              <span className="font-bold">{selectedPreset.values.process_temperature} K</span>
            </div>
            <div>
              <span className="text-slate-400 block">Rotational Speed</span>
              <span className="font-bold">{selectedPreset.values.rotational_speed} rpm</span>
            </div>
            <div>
              <span className="text-slate-400 block">Torque</span>
              <span className="font-bold">{selectedPreset.values.torque} Nm</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tool Wear</span>
              <span className="font-bold">{selectedPreset.values.tool_wear} min</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleRunDemo}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-60 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calling FastAPI endpoints...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Live Teaser Prediction</span>
                </>
              )}
            </button>

            <Link
              to="/predict"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Open full predictor dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Inline Error State */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-3 text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Live Result Output */}
          {resultData && (
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-blue-400 uppercase tracking-wider">
                  Live Response Result
                </span>
                <span className="text-slate-400">HTTP 200 OK</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Failure Risk</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-extrabold text-white">
                      {failureData ? `${(failureData.failure_probability * 100).toFixed(1)}%` : "N/A"}
                    </span>
                    {risk && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${risk.badgeClass}`}>
                        {risk.level}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block">Estimated Cost</span>
                  <span className="text-xl font-extrabold text-emerald-400 block mt-1">
                    {costData ? formatCurrency(costData.estimated_cost) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

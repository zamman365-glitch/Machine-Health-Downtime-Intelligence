import React, { useState } from "react";
import { PredictionForm } from "../components/PredictionForm";
import { FailureCard } from "../components/FailureCard";
import { CostCard } from "../components/CostCard";
import { DerivedMetrics } from "../components/DerivedMetrics";
import { Recommendation } from "../components/Recommendation";
import { HistoryTable } from "../components/HistoryTable";
import { RiskHistoryChart } from "../components/RiskHistoryChart";

import { useHistory } from "../hooks/useHistory";
import { usePrediction } from "../hooks/usePrediction";

export function PredictorPage({ onShowToast, theme }) {
  const { history, saveEntry, clearHistory } = useHistory();

  const {
    isLoading,
    isFailureRetrying,
    isCostRetrying,
    failureResult,
    costResult,
    failureError,
    costError,
    runPrediction,
    retryFailure,
    retryCost,
  } = usePrediction();

  // Form input live preview state for DerivedMetrics
  const [liveInputs, setLiveInputs] = useState({
    type: "M",
    air_temperature: 298.1,
    process_temperature: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 180,
  });

  const handleFormSubmit = async (payload) => {
    setLiveInputs(payload);

    const { failureData, costData, hasSuccess, bothSuccess } = await runPrediction(payload);

    if (bothSuccess) {
      if (onShowToast) onShowToast("Prediction and cost estimation completed!", "success");
    } else if (hasSuccess) {
      if (onShowToast) onShowToast("Partial prediction complete. One endpoint encountered an error.", "warning");
    } else {
      if (onShowToast) onShowToast("Both prediction endpoints failed. Check server connection.", "error");
    }

    if (hasSuccess) {
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: payload.type,
        air_temperature: payload.air_temperature,
        process_temperature: payload.process_temperature,
        rotational_speed: payload.rotational_speed,
        torque: payload.torque,
        tool_wear: payload.tool_wear,
        failure_prediction: failureData ? failureData.failure_prediction : 0,
        failure_probability: failureData ? failureData.failure_probability : 0,
        verdictText: failureData ? (failureData.failure_prediction === 1 ? "Failure" : "Normal") : "N/A",
        estimated_cost: costData ? costData.estimated_cost : 0,
      };

      saveEntry(historyItem);
    }
  };

  const handleRetryFailure = async () => {
    const data = await retryFailure();
    if (data) {
      if (onShowToast) onShowToast("Failure risk prediction retried successfully!", "success");
    } else {
      if (onShowToast) onShowToast("Failure risk retry failed.", "error");
    }
  };

  const handleRetryCost = async () => {
    const data = await retryCost();
    if (data) {
      if (onShowToast) onShowToast("Cost estimation retried successfully!", "success");
    } else {
      if (onShowToast) onShowToast("Cost estimation retry failed.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Dashboard Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Machine Health Predictor Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run live failure probability and maintenance cost inferences from sensor parameters
            </p>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Machine Parameters Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <PredictionForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              onLiveChange={(data) => {
                setLiveInputs({
                  type: data.type,
                  air_temperature: parseFloat(data.air_temperature) || 0,
                  process_temperature: parseFloat(data.process_temperature) || 0,
                  rotational_speed: parseFloat(data.rotational_speed) || 0,
                  torque: parseFloat(data.torque) || 0,
                  tool_wear: parseFloat(data.tool_wear) || 0,
                });
              }}
            />
          </div>

          {/* Right Column: Prediction Cards & Results Panel */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6" aria-live="polite">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FailureCard
                result={failureResult}
                isLoading={isLoading}
                isRetrying={isFailureRetrying}
                error={failureError}
                onRetry={handleRetryFailure}
              />
              <CostCard
                result={costResult}
                isLoading={isLoading}
                isRetrying={isCostRetrying}
                error={costError}
                onRetry={handleRetryCost}
              />
            </div>

            {/* Derived Metrics Strip */}
            <DerivedMetrics
              airTemperature={liveInputs.air_temperature}
              processTemperature={liveInputs.process_temperature}
              rotationalSpeed={liveInputs.rotational_speed}
              torque={liveInputs.torque}
            />

            {/* Recommendation Line */}
            <Recommendation
              probability={failureResult ? failureResult.failure_probability : null}
            />
          </div>
        </div>

        {/* Prediction History Section */}
        <section className="mt-8">
          <RiskHistoryChart history={history} theme={theme} />
          <HistoryTable
            history={history}
            onClearHistory={clearHistory}
            onShowToast={onShowToast}
          />
        </section>
      </main>
    </div>
  );
}

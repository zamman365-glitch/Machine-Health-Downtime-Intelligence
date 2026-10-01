import { apiClient } from "./client";

/**
 * Health check endpoint ping (GET /)
 */
export async function fetchApiHealth(signal) {
  try {
    const data = await apiClient("/", { method: "GET", signal }, 5000);
    return data && data.message === "Machine Health API is running";
  } catch (err) {
    return false;
  }
}

/**
 * Single failure prediction call (POST /predict/failure)
 */
export async function predictFailure(payload, signal) {
  return await apiClient("/predict/failure", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

/**
 * Single cost estimation call (POST /predict/cost)
 */
export async function predictCost(payload, signal) {
  return await apiClient("/predict/cost", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

/**
 * Parallel predictions call using Promise.allSettled
 */
export async function runParallelPredictions(payload, signal) {
  const [failureRes, costRes] = await Promise.allSettled([
    predictFailure(payload, signal),
    predictCost(payload, signal),
  ]);

  return {
    failure: {
      success: failureRes.status === "fulfilled",
      data: failureRes.status === "fulfilled" ? failureRes.value : null,
      error: failureRes.status === "rejected" ? failureRes.reason.message : null,
    },
    cost: {
      success: costRes.status === "fulfilled",
      data: costRes.status === "fulfilled" ? costRes.value : null,
      error: costRes.status === "rejected" ? costRes.reason.message : null,
    },
  };
}

import { useState, useRef, useEffect, useCallback } from "react";
import { runParallelPredictions, predictFailure, predictCost } from "../api/machineApi";

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFailureRetrying, setIsFailureRetrying] = useState(false);
  const [isCostRetrying, setIsCostRetrying] = useState(false);

  const [failureResult, setFailureResult] = useState(null);
  const [costResult, setCostResult] = useState(null);

  const [failureError, setFailureError] = useState(null);
  const [costError, setCostError] = useState(null);

  const [lastInputs, setLastInputs] = useState(null);

  const abortControllerRef = useRef(null);

  // Abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const runPrediction = useCallback(async (payload) => {
    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setFailureError(null);
    setCostError(null);
    setLastInputs(payload);

    try {
      const results = await runParallelPredictions(payload, controller.signal);
      
      const { failure, cost } = results;

      if (failure.success) {
        setFailureResult(failure.data);
        setFailureError(null);
      } else {
        setFailureResult(null);
        setFailureError(failure.error || "Failure prediction call failed.");
      }

      if (cost.success) {
        setCostResult(cost.data);
        setCostError(null);
      } else {
        setCostResult(null);
        setCostError(cost.error || "Cost estimation call failed.");
      }

      return {
        failureData: failure.success ? failure.data : null,
        costData: cost.success ? cost.data : null,
        hasSuccess: failure.success || cost.success,
        bothSuccess: failure.success && cost.success
      };
    } catch (err) {
      const msg = err.message || "Prediction failed.";
      setFailureError(msg);
      setCostError(msg);
      return { failureData: null, costData: null, hasSuccess: false, bothSuccess: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryFailure = useCallback(async (payloadOverride) => {
    const payload = payloadOverride || lastInputs;
    if (!payload) return null;

    setIsFailureRetrying(true);
    setFailureError(null);

    try {
      const data = await predictFailure(payload);
      setFailureResult(data);
      return data;
    } catch (err) {
      setFailureError(err.message || "Retry failure call failed.");
      return null;
    } finally {
      setIsFailureRetrying(false);
    }
  }, [lastInputs]);

  const retryCost = useCallback(async (payloadOverride) => {
    const payload = payloadOverride || lastInputs;
    if (!payload) return null;

    setIsCostRetrying(true);
    setCostError(null);

    try {
      const data = await predictCost(payload);
      setCostResult(data);
      return data;
    } catch (err) {
      setCostError(err.message || "Retry cost call failed.");
      return null;
    } finally {
      setIsCostRetrying(false);
    }
  }, [lastInputs]);

  return {
    isLoading,
    isFailureRetrying,
    isCostRetrying,
    failureResult,
    costResult,
    failureError,
    costError,
    lastInputs,
    runPrediction,
    retryFailure,
    retryCost
  };
}

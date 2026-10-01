import { useState, useEffect } from "react";
import { fetchApiHealth } from "../api/machineApi";

export function useApiHealth(pollIntervalMs = 30000) {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function checkHealth() {
      setIsChecking(true);
      const online = await fetchApiHealth(controller.signal);
      if (isMounted) {
        setIsOnline(online);
        setIsChecking(false);
      }
    }

    checkHealth();
    const timer = setInterval(checkHealth, pollIntervalMs);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(timer);
    };
  }, [pollIntervalMs]);

  return { isOnline, isChecking };
}

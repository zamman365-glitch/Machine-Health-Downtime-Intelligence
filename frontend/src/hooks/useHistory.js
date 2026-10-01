import { useState, useEffect, useCallback } from "react";

const HISTORY_KEY = "machine_health_history";

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Error reading prediction history from localStorage:", e);
      return [];
    }
  });

  const saveEntry = useCallback((entry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 20);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Error saving prediction history item:", e);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn("Error clearing history from localStorage:", e);
    }
  }, []);

  return { history, saveEntry, clearHistory };
}

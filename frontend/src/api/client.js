import { API_URL } from "../utils/constants";

/**
 * Fetch wrapper with timeout and normalized error handling
 */
export async function apiClient(endpoint, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const callerSignal = options.signal;
  if (callerSignal) {
    callerSignal.addEventListener("abort", () => controller.abort());
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = await parseApiError(response);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timed out after 10 seconds. Please check server availability.");
    }

    if (error.message && !error.message.includes("HTTP")) {
      // Re-throw parsed or timeout message directly
      throw error;
    }

    throw new Error(error.message || "Failed to communicate with Machine Health API. Server may be offline.");
  }
}

/**
 * Normalize error responses from FastAPI
 */
async function parseApiError(response) {
  try {
    const data = await response.json();
    if (data && data.detail) {
      if (typeof data.detail === "string") return data.detail;
      if (Array.isArray(data.detail)) {
        return data.detail.map((item) => item.msg || JSON.stringify(item)).join("; ");
      }
      return JSON.stringify(data.detail);
    }
  } catch (e) {
    // Non-JSON response body
  }

  if (response.status === 422) return "Invalid machine parameter input format or quality type.";
  if (response.status === 500) return "Database error while processing prediction on server.";

  return `Server returned error (${response.status}: ${response.statusText})`;
}

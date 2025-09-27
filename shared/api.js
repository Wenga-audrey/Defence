/**
 * Shared API utilities and types
 */
import { API_CONFIG, DEFAULT_HEADERS, REQUEST_TIMEOUT } from "./config";

// Get auth token from localStorage
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    // Primary key
    const primary = localStorage.getItem("auth_token");
    if (primary) return primary;
    // Backward compatibility: migrate legacy 'token' to 'auth_token'
    const legacy = localStorage.getItem("token");
    if (legacy) {
      try {
        localStorage.setItem("auth_token", legacy);
        localStorage.removeItem("token");
      } catch {}
      return legacy;
    }
  }
  return null;
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
};

// Common API headers
export const getAuthHeaders = (token) => ({
  ...DEFAULT_HEADERS,
  ...(token && { Authorization: `Bearer ${token}` }),
});

// API request wrapper with error handling
export async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const token = getAuthToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(token || undefined),
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const body = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        removeAuthToken();
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      }

      return {
        success: false,
        error: body.error || body.message || "An error occurred",
      };
    }

    // Unwrap common API shape { success, message, data }
    const unwrapped =
      body && typeof body === "object" && "data" in body ? body.data : body;

    return {
      success: true,
      data: unwrapped,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Network error",
    };
  }
}

// Convenience methods for different HTTP methods
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),

  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint) =>
    apiRequest(endpoint, { method: "DELETE" }),

  patch: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
};
/**
 * Shared API utilities and types
 */
import { API_CONFIG, DEFAULT_HEADERS, REQUEST_TIMEOUT } from "./config";

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN";
  avatar?: string;
  currentLevel?: string;
  examTargets?: string[];
  learningGoals?: string;
  availableHours?: number;
  isEmailVerified?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  examType: string;
  level: string;
  duration: number;
  price?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: string;
  timeLimit?: number;
  passingScore: number;
  questions?: Question[];
}

export interface Question {
  id: string;
  question: string;
  type: string;
  options?: string[];
  difficulty: string;
  points: number;
  order: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description?: string;
  examType: string;
  targetDate?: string;
  isActive: boolean;
  items: LearningPathItem[];
}

export interface LearningPathItem {
  id: string;
  courseId: string;
  order: number;
  isCompleted: boolean;
  scheduledDate?: string;
}

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
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
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
};

// Common API headers
export const getAuthHeaders = (token?: string): Record<string, string> => ({
  ...DEFAULT_HEADERS,
  ...(token && { Authorization: `Bearer ${token}` }),
});

// API request wrapper with error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
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
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),

  patch: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
};

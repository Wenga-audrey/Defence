// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3002",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: "/api/auth/reset-password",
    },
    USERS: {
      PROFILE: "/api/profile",
      UPDATE_PROFILE: "/api/profile",
    },
    COURSES: {
      LIST: "/api/courses",
      DETAIL: (id: string) => `/api/courses/${id}`,
      ENROLL: (id: string) => `/api/courses/${id}/enroll`,
    },
    ASSESSMENTS: {
      DETAIL: (id: string) => `/api/assessments/${id}`,
      SUBMIT: (id: string) => `/api/assessments/${id}/submit`,
      ADAPTIVE_GENERATE: "/api/assessments/adaptive/generate",
    },
    LEARNING_PATHS: {
      LIST: "/api/learning-paths",
      GENERATE: "/api/learning-paths/generate",
      DETAIL: (id: string) => `/api/learning-paths/${id}`,
    },
    ANALYTICS: {
      DASHBOARD: "/api/analytics/dashboard",
      PERFORMANCE: "/api/analytics/performance",
    },
    ADMIN: {
      DASHBOARD: "/api/admin/dashboard",
      USERS: "/api/admin/users",
      COURSES: "/api/admin/courses",
    },
  },
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Default headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

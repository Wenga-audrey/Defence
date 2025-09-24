import { api, setAuthToken } from "@shared/api";
import { API_CONFIG } from "@shared/config";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  currentLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  examTargets?: string[];
  learningGoals?: string;
  availableHours?: number;
}

export async function login(input: LoginInput) {
  const res = await api.post<{ user: any; token: string }>(
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    input,
  );
  if (!res.success) throw new Error(res.error || "Login failed");
  const { user, token } = res.data as any;
  setAuthToken(token);
  // Map backend roles to frontend dashboard paths
  const role = (user.role || "STUDENT") as string;
  const roleMap: Record<string, string> = {
    STUDENT: "learner",
    LEARNER: "learner",
    TEACHER: "instructor",
    INSTRUCTOR: "instructor",
    ADMIN: "admin",
    SUPER_ADMIN: "super-admin",
  };
  const dashboardRole = roleMap[role] || "learner";
  localStorage.setItem("userRole", dashboardRole);
  return { user, token, dashboardRole };
}

export async function register(input: RegisterInput) {
  const res = await api.post<{ user: any; token: string }>(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    input,
  );
  if (!res.success) throw new Error(res.error || "Registration failed");
  const { user, token } = res.data as any;
  setAuthToken(token);
  const role = (user.role || "STUDENT") as string;
  const roleMap: Record<string, string> = {
    STUDENT: "learner",
    LEARNER: "learner",
    TEACHER: "instructor",
    INSTRUCTOR: "instructor",
    ADMIN: "admin",
    SUPER_ADMIN: "super-admin",
  };
  const dashboardRole = roleMap[role] || "learner";
  localStorage.setItem("userRole", dashboardRole);
  return { user, token, dashboardRole };
}

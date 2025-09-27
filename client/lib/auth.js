import { api, setAuthToken } from "@shared/api";
import { API_CONFIG } from "@shared/config";

export async function login(input) {
  const res = await api.post(
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    input,
  );
  if (!res.success) throw new Error(res.error || "Login failed");
  const { user, token } = res.data;
  setAuthToken(token);
  // Map backend roles to frontend dashboard paths
  const role = (user.role || "STUDENT");
  const roleMap = {
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

export async function register(input) {
  const res = await api.post(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    input,
  );
  if (!res.success) throw new Error(res.error || "Registration failed");
  const { user, token } = res.data;
  setAuthToken(token);
  const role = (user.role || "STUDENT");
  const roleMap = {
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
import React from "react";
import { Navigate } from "react-router-dom";

function getRole(): "learner" | "instructor" | "admin" | "super-admin" | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("userRole");
  if (!token || !role) return null;
  if (
    role === "learner" ||
    role === "instructor" ||
    role === "admin" ||
    role === "super-admin"
  )
    return role as any;
  return "learner";
}

export const ProtectedRoute: React.FC<{
  children: React.ReactElement;
  allow: Array<"learner" | "instructor" | "admin" | "super-admin">;
}> = ({ children, allow }) => {
  const role = getRole();
  if (!role) return <Navigate to="/signin" replace />;
  if (!allow.includes(role)) {
    // Redirect to the proper dashboard
    return <Navigate to={`/dashboard/${role}`} replace />;
  }
  return children;
};

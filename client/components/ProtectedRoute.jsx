import React from "react";
import { Navigate } from "react-router-dom";

function getRole() {
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
    return role;
  return "learner";
}

export const ProtectedRoute = ({ children, allow }) => {
  const role = getRole();
  if (!role) return <Navigate to="/signin" replace />;
  if (!allow.includes(role)) {
    // Redirect to the proper dashboard
    return <Navigate to={`/dashboard/${role}`} replace />;
  }
  return children;
};
import React, { useState } from "react";
import LearnerNavBar from "./LearnerNavBar";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import LearnerDashboard from "@/pages/LearnerDashboard";
import InstructorDashboard from "@/pages/InstructorDashboard";
import PrepClassAdminDashboard from "@/pages/PrepClassAdminDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout({ children }) {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-gray-900 text-gray-100 min-h-screen" : "bg-gray-50 text-gray-900 min-h-screen"}>
      <header>
        <LearnerNavBar />
        <button
          className="absolute top-4 right-4 border px-2 py-1 rounded"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Simulate user role detection
  // In a real app, this would come from authentication context/API
  const getCurrentUserRole = () => {
    // For demo purposes, you can change this to test different roles
    // In production, this would be determined by the logged-in user's actual role
    const roles = ["learner", "instructor", "admin", "super-admin"];

    // Try to get role from localStorage (for demo)
    const storedRole = localStorage.getItem("userRole");
    if (storedRole && roles.includes(storedRole)) {
      return storedRole;
    }

    // Default to learner for demo
    return "learner";
  };

  useEffect(() => {
    const userRole = getCurrentUserRole();

    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case "learner":
        navigate("/dashboard/learner", { replace: true });
        break;
      case "instructor":
        navigate("/dashboard/instructor", { replace: true });
        break;
      case "admin":
        navigate("/dashboard/admin", { replace: true });
        break;
      case "super-admin":
        navigate("/dashboard/super-admin", { replace: true });
        break;
      default:
        navigate("/dashboard/learner", { replace: true });
    }
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-mindboost-green rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">
          Loading Dashboard...
        </h2>
        <p className="text-black/70">
          Redirecting you to your personalized dashboard
        </p>
      </div>
    </div>
  );
}

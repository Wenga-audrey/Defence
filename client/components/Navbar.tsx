import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <Link to="/" className="font-bold text-xl text-mindboost-green">Mindboost</Link>
      <div className="flex items-center gap-6">
        {isAuthenticated && user.role === "learner" && (
          <>
            <Link to="/dashboard/learner">Dashboard</Link>
            <Link to={`/profile/${user.id}`}>
              <Avatar src={user.avatarUrl} alt={user.name} />
            </Link>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";

export default function LearnerNavBar() {
  const { user } = useAuth();
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <Link to="/dashboard/learner" className="font-bold text-xl text-mindboost-green">Mindboost</Link>
      <div className="flex items-center gap-6">
        <Link to="/dashboard/learner">Dashboard</Link>
        <Link to="/profile">
          <Avatar src={user.avatarUrl} alt={user.name} />
        </Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/study-group">Study Group</Link>
        <Link to="/achievements">Achievements</Link>
        <Link to="/feedback">Feedback</Link>
      </div>
    </nav>
  );
}
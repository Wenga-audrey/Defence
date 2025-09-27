import React, { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import AIAdaptivePath from "@/components/AIAdaptivePath";
import AIScheduler from "@/components/AIScheduler";
import AIDashboard from "@/components/AIDashboard";
import AIGamification from "@/components/AIGamification";
import StudyGroupChat from "@/pages/StudyGroupChat";
import AIChatbotTutor from "@/components/AIChatbotTutor";

export default function LearnerDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AIAdaptivePath learnerId={user.id} />
      <AIScheduler learnerId={user.id} />
      <AIDashboard learnerId={user.id} />
      <AIGamification learnerId={user.id} />
      <StudyGroupChat classId={user.classId} />
      <AIChatbotTutor learnerId={user.id} />
    </div>
  );
}
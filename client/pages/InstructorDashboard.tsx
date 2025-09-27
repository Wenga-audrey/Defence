import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import QuizAI from "./QuizAI";

export default function InstructorDashboard() {
  const [prepClasses, setPrepClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [progress, setProgress] = useState([]);
  const [showQuizAI, setShowQuizAI] = useState(false);

  useEffect(() => {
    async function fetchClasses() {
      const res = await api.get("/api/instructor/prep-classes");
      if (res.success) setPrepClasses(res.prepClasses);
    }
    fetchClasses();
  }, []);

  async function handleViewProgress(classId) {
    const res = await api.get(`/api/instructor/prep-classes/${classId}/learner-progress`);
    if (res.success) setProgress(res.learners);
    setSelectedClass(classId);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>
      <div className="mb-4">
        <h2 className="font-semibold">Your Preparatory Classes</h2>
        <ul>
          {prepClasses.map(cls => (
            <li key={cls.id}>
              <Button onClick={() => handleViewProgress(cls.id)}>{cls.name}</Button>
            </li>
          ))}
        </ul>
      </div>
      {selectedClass && (
        <div>
          <h2 className="font-semibold">Learner Progress</h2>
          <ul>
            {progress.map(l => (
              <li key={l.user.id}>
                {l.user.name} - <Badge>{l.progress}%</Badge>
              </li>
            ))}
          </ul>
          <Button onClick={() => setShowQuizAI(true)}>Generate AI Quiz</Button>
          {showQuizAI && <QuizAI classId={selectedClass} />}
        </div>
      )}
    </div>
  );
}
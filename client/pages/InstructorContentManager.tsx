import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui/card";

export default function InstructorContentManager({ instructorId }) {
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchContent() {
      const resLessons = await api.get(`/api/instructor/${instructorId}/lessons`);
      if (resLessons.success) setLessons(resLessons.lessons);
      const resQuizzes = await api.get(`/api/instructor/${instructorId}/quizzes`);
      if (resQuizzes.success) setQuizzes(resQuizzes.quizzes);
    }
    fetchContent();
  }, [instructorId]);

  async function handleApproveQuiz(quizId) {
    await api.post(`/api/instructor/quizzes/${quizId}/approve`);
    setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, approved: true } : q));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
      </CardHeader>
      <CardContent>
        <h4>Lessons</h4>
        <ul>
          {lessons.map(l => <li key={l.id}>{l.title} {l.approved ? "✅" : "⏳"}</li>)}
        </ul>
        <h4 className="mt-4">Quizzes</h4>
        <ul>
          {quizzes.map(q => (
            <li key={q.id}>
              {q.title} {q.approved ? "✅" : <Button onClick={() => handleApproveQuiz(q.id)}>Approve</Button>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
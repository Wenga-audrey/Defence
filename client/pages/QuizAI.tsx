import React, { useState } from "react";
import { api } from "@shared/api";
import { Button } from "@/components/ui/button";

export default function QuizAI({ classId, subjectId, chapterId, topic }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerateQuiz() {
    setLoading(true);
    const res = await api.post("/api/ai/generate-quiz", { classId, subjectId, chapterId, topic });
    if (res.success) setQuestions(res.questions);
    setLoading(false);
  }

  return (
    <div>
      <Button onClick={handleGenerateQuiz} disabled={loading}>
        {loading ? "Generating..." : "Generate AI Quiz"}
      </Button>
      {questions.length > 0 && (
        <div>
          <h4>Generated Quiz:</h4>
          <ul>
            {questions.map((q, idx) => <li key={idx}>{q.text}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
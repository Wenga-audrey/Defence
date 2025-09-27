import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AIAdaptiveAssessment({ learnerId, subjectId }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      const res = await api.get(`/api/ai/adaptive-assessment/${learnerId}/${subjectId}`);
      if (res.success) setQuestions(res.questions);
    }
    fetchQuestions();
  }, [learnerId, subjectId]);

  async function handleSubmit() {
    const res = await api.post(`/api/ai/adaptive-assessment/${learnerId}/${subjectId}/feedback`, { answers });
    if (res.success) setFeedback(res.feedback);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adaptive Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {questions.map(q => (
          <div key={q.id} className="mb-4">
            <div>{q.text}</div>
            {q.options.map(opt => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`answer-${q.id}`}
                  value={opt}
                  onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        <Button onClick={handleSubmit}>Submit</Button>
        {feedback && (
          <div className="mt-4">
            <h4>Feedback</h4>
            <div>{feedback.summary}</div>
            <ul>
              {feedback.details.map((d, idx) => <li key={idx}>{d}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
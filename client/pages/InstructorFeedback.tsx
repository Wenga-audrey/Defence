import React, { useState } from "react";
import { api } from "@shared/api";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InstructorFeedback({ learnerId, subjectId }) {
  const [form, setForm] = useState({ feedback: "" });
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/api/instructor/feedback", { learnerId, subjectId, feedback: form.feedback });
    setSubmitted(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div>Feedback sent!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={form.feedback}
              onChange={e => setForm({ ...form, feedback: e.target.value })}
              required
              rows={4}
              placeholder="Enter feedback for learner"
            />
            <Button type="submit">Send Feedback</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
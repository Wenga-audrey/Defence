import React, { useState } from "react";
import { api } from "@shared/api";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LearnerOnboarding() {
  const [form, setForm] = useState({ examType: "", goals: "", availability: "" });
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/api/learner/onboarding", form);
    setSubmitted(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Mindboost!</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div>Thank you! Your personalized learning path will be generated.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Exam Type:
              <input type="text" value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })} required />
            </label>
            <label>
              Goals:
              <input type="text" value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })} required />
            </label>
            <label>
              Availability (e.g. 2 hours daily):
              <input type="text" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} required />
            </label>
            <Button type="submit">Start</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
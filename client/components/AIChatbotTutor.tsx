import React, { useState } from "react";
import { api } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui/card";

export default function AIChatbotTutor({ learnerId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  async function handleAsk() {
    const res = await api.post(`/api/ai/chatbot`, { learnerId, question });
    if (res.success) setAnswer(res.answer);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask the AI Tutor</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your question..." />
        <Button onClick={handleAsk}>Ask</Button>
        {answer && <div className="mt-4">{answer}</div>}
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { api } from "@shared/api";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LearnerFeedbackWidget({ learnerId }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSend() {
    await api.post("/api/learner/feedback", { learnerId, text });
    setSent(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? <div>Thank you for your feedback!</div> : (
          <div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              className="w-full border rounded p-2"
              placeholder="Your feedback..."
            />
            <Button onClick={handleSend} aria-label="Send Feedback">Send</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
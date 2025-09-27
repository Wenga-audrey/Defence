import React, { useState } from "react";
import Modal from "./ui/Modal";
import { Button } from "./ui/button";

export default function FeedbackResponseModal({ open, onClose, feedback, onRespond }) {
  const [response, setResponse] = useState("");
  if (!feedback) return null;
  return (
    <Modal open={open} onClose={onClose} title="Respond to Feedback">
      <div>
        <div className="mb-2"><strong>From:</strong> {feedback.learner.name}</div>
        <div className="mb-4"><strong>Feedback:</strong> {feedback.text}</div>
        <textarea
          className="w-full p-2 border rounded mb-4"
          value={response}
          onChange={e => setResponse(e.target.value)}
          rows={3}
          placeholder="Type your response..."
          aria-label="Response"
        />
        <Button onClick={() => {
          onRespond(response);
          setResponse("");
        }}>
          Send Response
        </Button>
      </div>
    </Modal>
  );
}
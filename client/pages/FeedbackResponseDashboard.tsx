import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import FeedbackResponseModal from "@/components/FeedbackResponseModal";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui/card";

export default function FeedbackResponseDashboard() {
  const [pendingFeedback, setPendingFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFeedback() {
      const res = await api.get("/api/feedback/pending");
      if (res.success) setPendingFeedback(res.feedbacks);
    }
    fetchFeedback();
  }, []);

  async function handleRespond(responseText) {
    await api.post(`/api/feedback/${selectedFeedback.id}/respond`, { response: responseText });
    setPendingFeedback(pendingFeedback.filter(fb => fb.id !== selectedFeedback.id));
    setModalOpen(false);
    setSelectedFeedback(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Response Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {pendingFeedback.map(fb => (
            <li key={fb.id} className="mb-4 p-2 border-b">
              <div>
                <b>{fb.learner.name}</b> on <i>{fb.subject.title}</i>:<br />
                <span>{fb.text}</span>
              </div>
              <Button
                onClick={() => {
                  setSelectedFeedback(fb);
                  setModalOpen(true);
                }}
                aria-label={`Respond to feedback from ${fb.learner.name}`}
              >
                Respond
              </Button>
            </li>
          ))}
        </ul>
        <FeedbackResponseModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          feedback={selectedFeedback}
          onRespond={handleRespond}
        />
      </CardContent>
    </Card>
  );
}
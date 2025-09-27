import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui/card";

export default function InstructorContentApproval({ instructorId }) {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    async function fetchPending() {
      const res = await api.get(`/api/instructor/${instructorId}/pending-content`);
      if (res.success) setPending(res.pending);
    }
    fetchPending();
  }, [instructorId]);

  async function handleApprove(id) {
    await api.post(`/api/instructor/content/${id}/approve`);
    setPending(pending.filter(c => c.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Content Approval</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {pending.map(content => (
            <li key={content.id}>
              {content.title}
              <Button onClick={() => handleApprove(content.id)} aria-label={`Approve ${content.title}`}>Approve</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
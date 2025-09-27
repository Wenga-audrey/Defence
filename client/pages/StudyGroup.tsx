import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudyGroup() {
  const { classId } = useParams<{ classId: string }>();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    async function fetchGroup() {
      const res = await api.get(`/api/prep-classes/${classId}/study-group`);
      if (res.success) setGroup(res.group);
    }
    fetchGroup();
  }, [classId]);

  if (!group) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name} Study Group</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h4>Members:</h4>
          <ul>
            {group.members.map((member: any) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
          <h4>Messages:</h4>
          <div>
            {group.messages.map((msg: any) => (
              <div key={msg.id}><b>{msg.senderName}:</b> {msg.text}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
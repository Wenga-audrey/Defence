import React, { useEffect, useState, useRef } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui/card";

export default function StudyGroupChat({ classId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      const res = await api.get(`/api/prep-classes/${classId}/study-group/messages`);
      if (res.success) setMessages(res.messages);
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [classId]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (text.trim() === "") return;
    await api.post(`/api/prep-classes/${classId}/study-group/messages`, { text });
    setText("");
    // Optimistically update or refetch
    const res = await api.get(`/api/prep-classes/${classId}/study-group/messages`);
    if (res.success) setMessages(res.messages);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Study Group Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ maxHeight: 360, overflowY: "auto", marginBottom: 8 }}>
          {messages.map(msg => (
            <div key={msg.id} className="mb-2">
              <b>{msg.senderName}</b>: {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Your message..."
            className="flex-1 border px-2 py-1 rounded"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
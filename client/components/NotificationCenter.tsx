import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui/card";

let ws;

export default function NotificationCenter({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Try websocket first
    try {
      ws = new WebSocket(`wss://your-backend-domain/ws/notifications?userId=${userId}`);
      ws.onmessage = event => {
        const msg = JSON.parse(event.data);
        setNotifications(prev => [msg, ...prev]);
      };
      ws.onerror = () => {
        // Fallback to polling
        pollNotifications();
      };
    } catch {
      // Fallback to polling
      pollNotifications();
    }
    return () => ws?.close();
  }, [userId]);

  async function pollNotifications() {
    const fetchNotifications = async () => {
      const res = await fetch(`/api/notifications/${userId}`);
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {notifications.map(n => (
            <li key={n.id} className={n.unread ? "font-bold" : ""}>
              <Badge>{n.type}</Badge> {n.message}
              <span className="text-gray-400 ml-2 text-xs">{new Date(n.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
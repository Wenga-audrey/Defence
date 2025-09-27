import { useState, useEffect } from "react";
import { api } from "@shared/api";

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const res = await api.get(`/api/notifications/${userId}`);
      if (res.success) setNotifications(res.data);
    }
    fetchNotifications();
  }, [userId]);

  return notifications;
}
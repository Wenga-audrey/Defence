import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Calendar } from "@/components/ui/calendar";

export default function AIScheduler({ learnerId }) {
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    async function fetchSchedule() {
      const res = await api.get(`/api/ai/schedule/${learnerId}`);
      if (res.success) setSchedule(res.schedule);
    }
    fetchSchedule();
  }, [learnerId]);
  return (
    <Calendar events={schedule} />
  );
}
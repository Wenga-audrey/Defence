import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui/card";

export default function SystemMaintenance() {
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      const res = await api.get("/api/status");
      if (res.success) setMaintenance(res.maintenance);
    }
    fetchStatus();
  }, []);

  async function handleToggle() {
    await api.post("/api/status/toggle");
    setMaintenance(!maintenance);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Status: {maintenance ? "Under Maintenance" : "Online"}</div>
        <Button onClick={handleToggle}>{maintenance ? "Resume Service" : "Start Maintenance"}</Button>
      </CardContent>
    </Card>
  );
}
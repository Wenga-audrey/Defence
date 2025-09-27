import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ComplianceAuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await api.get("/api/superAdmin/audit-logs");
      if (res.success) setLogs(res.logs);
    }
    fetchLogs();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit & Compliance Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {logs.map(log => (
            <li key={log.id}>
              <span className="font-mono">{log.createdAt}</span> — <span>{log.action}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
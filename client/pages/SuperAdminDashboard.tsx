import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingLessons, setPendingLessons] = useState([]);
  const [pendingSyllabi, setPendingSyllabi] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchDashboard() {
      const res = await api.get("/api/superAdmin/dashboard");
      if (res.success) setStats(res.stats);
      const pending = await api.get("/api/superAdmin/pending-content");
      if (pending.success) {
        setPendingLessons(pending.lessons);
        setPendingSyllabi(pending.syllabi);
      }
      const audit = await api.get("/api/superAdmin/audit-logs");
      if (audit.success) setLogs(audit.logs);
    }
    fetchDashboard();
  }, []);

  async function handleApproveLesson(id) {
    await api.post(`/api/superAdmin/lessons/${id}/approve`);
    setPendingLessons(pendingLessons.filter(l => l.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Users: {stats.userStats}</div>
            <div>Paid Users: {stats.paidUsers}</div>
            <div>Revenue: {stats.revenue}</div>
            <div>Active Exams: {stats.exams}</div>
            <div>Courses: {stats.courses}</div>
            <div>Success Rates: {stats.successRates?.rate}</div>
          </CardContent>
        </Card>
      )}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending Lessons/Syllabi</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <h2>Lessons</h2>
            <ul>
              {pendingLessons.map(lesson => (
                <li key={lesson.id}>
                  {lesson.title}
                  <Button onClick={() => handleApproveLesson(lesson.id)}>Approve</Button>
                </li>
              ))}
            </ul>
            <h2>Syllabi</h2>
            <ul>
              {pendingSyllabi.map(syl => (
                <li key={syl.id}>
                  {syl.title}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {logs.map(log => (
              <li key={log.id}>{log.createdAt}: {log.action}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
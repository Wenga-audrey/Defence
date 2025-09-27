import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";

export default function InstructorAnalytics({ classId }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await api.get(`/api/instructor/prep-classes/${classId}/analytics`);
      if (res.success) setAnalytics(res.analytics);
    }
    fetchAnalytics();
  }, [classId]);

  if (!analytics) return <div>Loading...</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ProgressBar value={analytics.avgProgress} label="Average Progress" />
        <div>Success Rate: {analytics.successRate}%</div>
        <div>Active Learners: {analytics.activeLearners}</div>
        <div>Leaderboard Top: {analytics.leaderboardTop.map(l => l.name).join(", ")}</div>
      </CardContent>
    </Card>
  );
}
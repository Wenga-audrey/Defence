import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { ProgressBar } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIDashboard({ learnerId }) {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    async function fetchAnalytics() {
      const res = await api.get(`/api/ai/analytics/${learnerId}`);
      if (res.success) setAnalytics(res.analytics);
    }
    fetchAnalytics();
  }, [learnerId]);
  if (!analytics) return <div>Loading...</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <ProgressBar value={analytics.predictedSuccess} label="Exam Readiness" />
          <div>{analytics.predictedSuccess}% chance to pass exam if current pace continues</div>
          <ul>
            {analytics.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
          {/* Include graphs if needed */}
        </div>
      </CardContent>
    </Card>
  );
}
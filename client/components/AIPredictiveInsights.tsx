import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AIPredictiveInsights({ learnerId }) {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    async function fetchInsights() {
      const res = await api.get(`/api/ai/predictive/${learnerId}`);
      if (res.success) setInsights(res.insights);
    }
    fetchInsights();
  }, [learnerId]);

  if (!insights) return <div>Loading...</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Success Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <strong>Likelihood to Pass:</strong> {insights.likelihood}%<br />
          <strong>Key Recommendations:</strong>
          <ul>
            {insights.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
          </ul>
          {insights.atRisk && <div className="text-red-600 font-bold">At Risk: Seek help on {insights.weakAreas.join(", ")}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIAdaptivePath({ learnerId }) {
  const [path, setPath] = useState([]);
  useEffect(() => {
    async function fetchPath() {
      const res = await api.get(`/api/ai/learning-path/${learnerId}`);
      if (res.success) setPath(res.path);
    }
    fetchPath();
  }, [learnerId]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Learning Path</CardTitle>
      </CardHeader>
      <CardContent>
        <ol>
          {path.map((lesson, idx) => (
            <li key={lesson.id}>{idx + 1}. {lesson.title} <span>{lesson.area === "weak" ? "🔴 Focus" : "🟢 Practice"}</span></li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui/card";

export default function AIGamification({ learnerId }) {
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    async function fetchGamification() {
      const res = await api.get(`/api/ai/gamification/${learnerId}`);
      if (res.success) {
        setBadges(res.badges);
        setLeaderboard(res.leaderboard);
      }
    }
    fetchGamification();
  }, [learnerId]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements & Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h4>Badges</h4>
          <div className="flex gap-2 flex-wrap">
            {badges.map(badge => (
              <Badge key={badge.id}>{badge.label}</Badge>
            ))}
          </div>
          <h4 className="mt-4">Leaderboard</h4>
          <ol>
            {leaderboard.map((entry, idx) => (
              <li key={entry.id} className={entry.id === learnerId ? "font-bold text-mindboost-green" : ""}>
                {idx + 1}. {entry.name} ({entry.points} pts)
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
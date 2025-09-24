import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
}

interface UserAchievement {
  id: string;
  achievement: Achievement;
  unlockedAt: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  totalPoints: number;
}

const AchievementsPage: React.FC = () => {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
    fetchLeaderboard();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        setUserAchievements(data.data.unlocked);
        setAvailableAchievements(data.data.available);
        setTotalPoints(data.data.totalPoints);
      } else {
        alert('Error fetching achievements');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/achievements/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.data);
      } else {
        alert('Error fetching leaderboard');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Achievements & Leaderboards</h1>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">My Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Total Points: {totalPoints}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Unlocked Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userAchievements.map((ua) => (
                    <div key={ua.id} className="border rounded-lg p-4 text-center">
                      <div className="text-4xl mb-2">{ua.achievement.icon}</div>
                      <h4 className="font-semibold">{ua.achievement.title}</h4>
                      <p className="text-sm text-gray-600">{ua.achievement.description}</p>
                      <Badge variant="secondary">{ua.achievement.points} points</Badge>
                      <p className="text-xs text-gray-500 mt-2">Unlocked: {new Date(ua.unlockedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Available Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableAchievements.map((a) => (
                    <div key={a.id} className="border rounded-lg p-4 text-center opacity-50">
                      <div className="text-4xl mb-2">{a.icon}</div>
                      <h4 className="font-semibold">{a.title}</h4>
                      <p className="text-sm text-gray-600">{a.description}</p>
                      <Badge variant="outline">{a.points} points</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Top Learners</CardTitle>
              <CardDescription>See how you rank among other students.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div key={entry.userId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold">{index + 1}.</div>
                      <div>
                        <h4 className="font-semibold">{entry.name}</h4>
                        <p className="text-sm text-gray-600">User ID: {entry.userId}</p>
                      </div>
                    </div>
                    <Badge variant="default">{entry.totalPoints} points</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsPage;

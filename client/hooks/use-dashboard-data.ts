import { useState, useEffect } from 'react';
import { api } from '@shared/api';

interface DashboardStats {
  enrollments: { active: number; completed: number };
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number;
}

interface RecentActivity {
  studySessions: Array<{
    id: string;
    duration: number;
    startTime: string;
    lesson?: { title: string; course?: { title: string } };
  }>;
  assessmentResults: Array<{
    id: string;
    score: number;
    completedAt: string;
    assessment: { title: string; type: string; passingScore: number };
  }>;
}

interface LearningPath {
  id: string;
  name: string;
  examType: string;
  progress: number;
  totalItems: number;
  completedItems: number;
}

interface DashboardData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    currentLevel: string;
    examTargets: string[];
    availableHours: number;
  };
  stats: DashboardStats;
  recentActivity: RecentActivity;
  learningPaths: LearningPath[];
  upcomingItems: Array<{
    id: string;
    scheduledDate: string;
    learningPath: { name: string };
  }>;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<DashboardData>('/api/users/dashboard');
        if (response.success) {
          setData(response.data || null);
        } else {
          setError(response.error || 'Failed to load dashboard data');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, refetch: () => setLoading(true) };
}

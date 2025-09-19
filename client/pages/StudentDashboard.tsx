import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  BarChart3,
  Calendar,
  Brain,
  Zap
} from 'lucide-react';
import { useAuth } from '../hooks/use-auth';

interface CourseProgress {
  id: string;
  title: string;
  examType: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  thumbnail?: string;
}

interface AssessmentResult {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  completedAt: string;
  difficulty: string;
  subject: string;
}

interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface WeakArea {
  subject: string;
  topic: string;
  accuracy: number;
  questionsAttempted: number;
  lastPracticed: string;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalAssessments: number;
  averageScore: number;
  studyTimeThisWeek: number;
  studyTimeTotal: number;
  rank: number;
  totalStudents: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<AssessmentResult[]>([]);
  const [studyStreak, setStudyStreak] = useState<StudyStreak | null>(null);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all dashboard data in parallel
      const [
        progressRes,
        assessmentsRes,
        streakRes,
        weakAreasRes,
        statsRes,
        performanceRes
      ] = await Promise.all([
        fetch('/api/analytics/course-progress', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/analytics/recent-assessments', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/analytics/study-streak', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/analytics/weak-areas', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/analytics/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/analytics/performance-trend', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (progressRes.ok) {
        const data = await progressRes.json();
        setCourseProgress(data.data || []);
      }

      if (assessmentsRes.ok) {
        const data = await assessmentsRes.json();
        setRecentAssessments(data.data || []);
      }

      if (streakRes.ok) {
        const data = await streakRes.json();
        setStudyStreak(data.data);
      }

      if (weakAreasRes.ok) {
        const data = await weakAreasRes.json();
        setWeakAreas(data.data || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setDashboardStats(data.data);
      }

      if (performanceRes.ok) {
        const data = await performanceRes.json();
        setPerformanceData(data.data || []);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Track your learning progress and achievements
            </p>
          </div>
          <Button onClick={fetchDashboardData} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold">{dashboardStats?.totalCourses || 0}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Average Score</p>
                  <p className="text-3xl font-bold">{dashboardStats?.averageScore || 0}%</p>
                </div>
                <Target className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Study Streak</p>
                  <p className="text-3xl font-bold">{studyStreak?.currentStreak || 0} days</p>
                </div>
                <Zap className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Global Rank</p>
                  <p className="text-3xl font-bold">#{dashboardStats?.rank || 0}</p>
                </div>
                <Trophy className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Progress
                  </CardTitle>
                  <CardDescription>Your current learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseProgress.slice(0, 3).map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-600">{course.examType}</p>
                        </div>
                        <Badge variant="secondary">{course.progress}%</Badge>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {course.completedLessons}/{course.totalLessons} lessons completed
                      </p>
                    </div>
                  ))}
                  {courseProgress.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No courses enrolled yet. Start your learning journey!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Assessments
                  </CardTitle>
                  <CardDescription>Your latest test results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAssessments.slice(0, 4).map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{assessment.title}</h4>
                        <p className="text-xs text-gray-600">{assessment.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(assessment.score, assessment.maxScore)}`}>
                          {assessment.score}/{assessment.maxScore}
                        </p>
                        <Badge className={getDifficultyColor(assessment.difficulty)} variant="secondary">
                          {assessment.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recentAssessments.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No assessments taken yet. Take your first quiz!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Study Streak & Weak Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Study Streak */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Study Streak
                  </CardTitle>
                  <CardDescription>Keep the momentum going!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studyStreak && (
                    <>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">
                          {studyStreak.currentStreak}
                        </div>
                        <p className="text-gray-600">Days in a row</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Weekly Goal</span>
                          <span>{studyStreak.weeklyProgress}/{studyStreak.weeklyGoal} days</span>
                        </div>
                        <Progress 
                          value={(studyStreak.weeklyProgress / studyStreak.weeklyGoal) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{studyStreak.longestStreak}</p>
                          <p className="text-xs text-gray-600">Longest Streak</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{studyStreak.totalStudyDays}</p>
                          <p className="text-xs text-gray-600">Total Study Days</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Weak Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Areas to Improve
                  </CardTitle>
                  <CardDescription>Focus on these topics for better results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {weakAreas.slice(0, 4).map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div>
                        <h4 className="font-medium text-sm">{area.topic}</h4>
                        <p className="text-xs text-gray-600">{area.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          {area.accuracy}% accuracy
                        </p>
                        <p className="text-xs text-gray-500">
                          {area.questionsAttempted} questions
                        </p>
                      </div>
                    </div>
                  ))}
                  {weakAreas.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Great job! No weak areas identified yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Course Progress</CardTitle>
                <CardDescription>Track your progress across all enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courseProgress.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.examType}</p>
                        </div>
                        <Badge variant={course.progress === 100 ? "default" : "secondary"}>
                          {course.progress === 100 ? "Completed" : `${course.progress}% Complete`}
                        </Badge>
                      </div>
                      <Progress value={course.progress} className="h-3 mb-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment History</CardTitle>
                  <CardDescription>Your complete assessment record</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAssessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{assessment.title}</h4>
                          <p className="text-sm text-gray-600">{assessment.subject}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(assessment.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(assessment.score, assessment.maxScore)}`}>
                            {Math.round((assessment.score / assessment.maxScore) * 100)}%
                          </p>
                          <Badge className={getDifficultyColor(assessment.difficulty)} variant="secondary">
                            {assessment.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Statistics</CardTitle>
                  <CardDescription>Your learning analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">
                        {formatDuration(dashboardStats?.studyTimeThisWeek || 0)}
                      </p>
                      <p className="text-sm text-gray-600">This Week</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        {formatDuration(dashboardStats?.studyTimeTotal || 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Time</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Global Ranking</span>
                      <Badge variant="outline">
                        #{dashboardStats?.rank || 0} of {dashboardStats?.totalStudents || 0}
                      </Badge>
                    </div>
                    <Progress 
                      value={dashboardStats?.rank ? ((dashboardStats.totalStudents - dashboardStats.rank) / dashboardStats.totalStudents) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Goals
                </CardTitle>
                <CardDescription>Set and track your learning objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {studyStreak && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Weekly Study Goal</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{studyStreak.weeklyProgress}/{studyStreak.weeklyGoal} days</span>
                      </div>
                      <Progress 
                        value={(studyStreak.weeklyProgress / studyStreak.weeklyGoal) * 100} 
                        className="h-3" 
                      />
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Course Completion Goals</h3>
                  <div className="space-y-3">
                    {courseProgress.filter(course => course.progress < 100).map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <span className="text-sm">{course.title}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={course.progress} className="w-20 h-2" />
                          <span className="text-sm text-gray-600">{course.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Keep up the great work! Consistency is key to success.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIRecommendations from '@/components/AIRecommendations';
import AIAssistant from '@/components/AIAssistant';
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Users,
  Calendar,
  Play,
  Target,
  Award,
  BarChart3,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Star,
  Fire,
  Zap,
  Brain,
  CheckCircle,
  AlertCircle,
  Activity,
  Download,
  Share,
  RefreshCw,
  Plus,
  Eye,
  ArrowRight,
  Sparkles,
} from '@/lib/icons';
import { useAuth } from '@/hooks/use-auth';

export default function LearnerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentQuizResults, setRecentQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        if (!token) {
          navigate('/signin');
          return;
        }

        // Fetch learner context (active class and subjects)
        const contextResponse = await fetch('/api/learner/context', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (contextResponse.ok) {
          const contextData = await contextResponse.json();
          if (contextData.success) {
            setSubjects(contextData.data.subjects || []);
          }
        }

        // Fetch dashboard stats
        const dashboardResponse = await fetch('/api/learner/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (dashboardResponse.ok) {
          const dashboardResult = await dashboardResponse.json();
          if (dashboardResult.success) {
            setDashboardData(dashboardResult.data);
          }
        }

        // Fetch recent quiz results
        const quizResponse = await fetch('/api/learner/recent-quiz-results', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (quizResponse.ok) {
          const quizResult = await quizResponse.json();
          if (quizResult.success) {
            setRecentQuizResults(quizResult.data || []);
          }
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Mock data fallback if API fails
  const mockSubjects = [
    {
      id: 'mathematics',
      title: 'Mathematics',
      examType: 'ENS',
      totalLessons: 12,
      completedLessons: 8,
      progress: 67,
      lastAccessed: '2024-01-15T10:30:00Z',
      thumbnail: null
    },
    {
      id: 'physics',
      title: 'Physics',
      examType: 'ENS',
      totalLessons: 10,
      completedLessons: 5,
      progress: 50,
      lastAccessed: '2024-01-14T14:20:00Z',
      thumbnail: null
    },
    {
      id: 'chemistry',
      title: 'Chemistry',
      examType: 'ENS',
      totalLessons: 8,
      completedLessons: 3,
      progress: 38,
      lastAccessed: '2024-01-13T09:15:00Z',
      thumbnail: null
    },
    {
      id: 'biology',
      title: 'Biology',
      examType: 'ENS',
      totalLessons: 9,
      completedLessons: 6,
      progress: 67,
      lastAccessed: '2024-01-16T11:45:00Z',
      thumbnail: null
    },
    {
      id: 'literature',
      title: 'Literature',
      examType: 'ENS',
      totalLessons: 7,
      completedLessons: 4,
      progress: 57,
      lastAccessed: '2024-01-12T16:30:00Z',
      thumbnail: null
    },
    {
      id: 'philosophy',
      title: 'Philosophy',
      examType: 'ENS',
      totalLessons: 6,
      completedLessons: 2,
      progress: 33,
      lastAccessed: '2024-01-11T13:20:00Z',
      thumbnail: null
    }
  ];

  const mockDashboardData = {
    totalCourses: 6,
    completedCourses: 2,
    totalAssessments: 15,
    averageScore: 78,
    studyTimeThisWeek: 12,
    studyTimeTotal: 45,
    rank: 23,
    totalStudents: 150
  };

  const mockRecentQuizResults = [
    {
      id: '1',
      title: 'Mathematics Quiz 1',
      score: 85,
      maxScore: 100,
      completedAt: '2024-01-15T10:30:00Z',
      difficulty: 'Medium',
      subject: 'Mathematics'
    },
    {
      id: '2',
      title: 'Physics Quiz 2',
      score: 72,
      maxScore: 100,
      completedAt: '2024-01-14T14:20:00Z',
      difficulty: 'Hard',
      subject: 'Physics'
    }
  ];

  // Use fetched data or fallback to mock data
  const displaySubjects = subjects.length > 0 ? subjects : mockSubjects;
  const displayDashboardData = dashboardData || mockDashboardData;
  const displayQuizResults = recentQuizResults.length > 0 ? recentQuizResults : mockRecentQuizResults;

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Preparing your personalized learning experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black text-gray-900">
                    Mind<span className="text-blue-600">Boost</span>
                  </span>
                  <div className="text-xs text-gray-500 font-medium -mt-1">
                    Learner Dashboard
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
              >
                <Brain className="h-5 w-5 mr-2" />
                AI Assistant
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl">
                <Bell className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">Student</div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Welcome back, {user?.firstName || 'Student'}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{displayDashboardData.rank}</div>
                <div className="text-sm text-gray-500">Your Rank</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{displayDashboardData.averageScore}%</div>
                <div className="text-sm text-gray-500">Avg Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">{displayDashboardData.totalCourses}</div>
                  <div className="text-blue-100 text-sm font-medium">Enrolled Courses</div>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">{displayDashboardData.averageScore}%</div>
                  <div className="text-green-100 text-sm font-medium">Average Score</div>
                </div>
                <Trophy className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">{displayDashboardData.studyTimeThisWeek}h</div>
                  <div className="text-purple-100 text-sm font-medium">This Week</div>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">#{displayDashboardData.rank}</div>
                  <div className="text-orange-100 text-sm font-medium">Class Rank</div>
                </div>
                <Award className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Subjects */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <BookOpen className="h-6 w-6 mr-3 text-blue-500" />
                      Your Subjects
                    </CardTitle>
                    <p className="text-gray-600 mt-1">Continue your learning journey</p>
                  </div>
                  <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Link to="/courses">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {displaySubjects.map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => handleSubjectClick(subject.id)}
                      className="group p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                            {subject.title[0]}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {subject.title}
                            </h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {subject.examType}
                              </Badge>
                              <span>{subject.completedLessons}/{subject.totalLessons} lessons</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{subject.progress}%</div>
                          <div className="text-sm text-gray-500">Complete</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-3" />
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Last accessed: {new Date(subject.lastAccessed).toLocaleDateString()}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Quiz Results */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Target className="h-6 w-6 mr-3 text-green-500" />
                    Recent Quiz Results
                  </CardTitle>
                  <Button asChild variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                    <Link to="/quiz">
                      <Plus className="h-4 w-4 mr-2" />
                      Take Quiz
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {displayQuizResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No quiz results yet</p>
                    <Button asChild className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <Link to="/quiz">Take Your First Quiz</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayQuizResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {Math.round((result.score / result.maxScore) * 100)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{result.title}</h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span>{new Date(result.completedAt).toLocaleDateString()}</span>
                              <Badge variant="outline" className="text-xs">
                                {result.subject}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {result.score}/{result.maxScore}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.round((result.score / result.maxScore) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <AIRecommendations />

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600">
                  <Link to="/quiz">
                    <Target className="h-4 w-4 mr-3" />
                    Take Practice Quiz
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-purple-200 text-purple-600 hover:bg-purple-50">
                  <Link to="/study-calendar">
                    <Calendar className="h-4 w-4 mr-3" />
                    Study Calendar
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50">
                  <Link to="/forums">
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Study Forums
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50">
                  <Link to="/achievements">
                    <Award className="h-4 w-4 mr-3" />
                    Achievements
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-black">12</div>
                    <div className="text-orange-100 text-sm font-medium">Day Streak</div>
                  </div>
                  <Fire className="h-8 w-8 text-orange-200" />
                </div>
                <div className="text-sm text-orange-100">
                  Keep it up! You're on fire! 🔥
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Week</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-semibold">+12%</span>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-t from-blue-100 to-transparent rounded-lg flex items-end justify-center">
                    <div className="text-sm text-gray-500">Performance chart placeholder</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant isOpen={showAIAssistant} onToggle={() => setShowAIAssistant(!showAIAssistant)} />
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  Play,
  CheckCircle,
  Target,
  Award,
  BarChart3,
  Users,
  MessageCircle,
  Bell,
  Settings,
  Menu,
  X,
  ChevronRight,
  Star,
  Zap,
  Heart,
  Shield,
  GraduationCap,
  Activity,
  AlertCircle,
  Search,
  FileText,
  User,
  LogOut,
  Fire,
  Sparkles,
  Brain,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import AIRecommendations from "@/components/AIRecommendations";

export default function LearnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { user, isLoading } = useAuth();

  const recentCourses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      subtitle: "Calculus & Differential Equations",
      progress: 75,
      lastAccessed: "2 hours ago",
      institution: "ENSP Yaoundé",
      nextLesson: "Integration by Parts",
      color: "from-blue-500 to-indigo-500",
      difficulty: "Advanced",
    },
    {
      id: 2,
      title: "Physics",
      subtitle: "Thermodynamics & Heat Transfer",
      progress: 45,
      lastAccessed: "1 day ago",
      institution: "ENSP Yaoundé",
      nextLesson: "Heat Engines",
      color: "from-purple-500 to-violet-500",
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "Technical Drawing",
      subtitle: "3D Modeling & Projections",
      progress: 90,
      lastAccessed: "3 hours ago",
      institution: "ENSET Douala",
      nextLesson: "3D Projections",
      color: "from-emerald-500 to-teal-500",
      difficulty: "Beginner",
    },
  ];

  const upcomingTests = [
    {
      id: 1,
      title: "Mathematics Mock Exam",
      date: "Tomorrow",
      time: "2:00 PM",
      duration: "3 hours",
      type: "Mock Exam",
      importance: "high",
      subject: "Mathematics",
    },
    {
      id: 2,
      title: "Physics Quiz - Chapter 5",
      date: "Dec 28",
      time: "10:00 AM",
      duration: "1 hour",
      type: "Quiz",
      importance: "medium",
      subject: "Physics",
    },
    {
      id: 3,
      title: "Final Assessment",
      date: "Jan 5",
      time: "9:00 AM",
      duration: "4 hours",
      type: "Final Exam",
      importance: "high",
      subject: "General",
    },
  ];

  const achievements = [
    { title: "First Week Completed", icon: Trophy, date: "Dec 20", color: "text-yellow-500", bg: "bg-yellow-100" },
    { title: "Math Quiz Champion", icon: Star, date: "Dec 18", color: "text-blue-500", bg: "bg-blue-100" },
    { title: "Perfect Attendance", icon: Award, date: "Dec 15", color: "text-green-500", bg: "bg-green-100" },
    { title: "Study Streak 7 Days", icon: Fire, date: "Dec 22", color: "text-red-500", bg: "bg-red-100" },
  ];

  const stats = [
    {
      label: "Courses Enrolled",
      value: "5",
      icon: BookOpen,
      change: "+2 this month",
      changeType: "positive",
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Hours Studied",
      value: "127",
      icon: Clock,
      change: "+15 this week",
      changeType: "positive",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Assignments Complete",
      value: "28",
      icon: CheckCircle,
      change: "3 pending",
      changeType: "neutral",
      color: "from-purple-500 to-violet-500",
    },
    {
      label: "Current Rank",
      value: "#12",
      icon: TrendingUp,
      change: "↑ 5 positions",
      changeType: "positive",
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentActivity = [
    {
      action: "Completed",
      item: "Mathematics - Derivatives Quiz",
      time: "2 hours ago",
      score: "95%",
      type: "quiz",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      action: "Started",
      item: "Physics - Thermodynamics Chapter",
      time: "5 hours ago",
      score: null,
      type: "lesson",
      icon: Play,
      color: "text-blue-500",
    },
    {
      action: "Submitted",
      item: "Technical Drawing Assignment",
      time: "1 day ago",
      score: "88%",
      type: "assignment",
      icon: FileText,
      color: "text-purple-500",
    },
    {
      action: "Attended",
      item: "Live Session: Advanced Calculus",
      time: "2 days ago",
      score: null,
      type: "session",
      icon: Users,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900">MindBoost</span>
            </Link>

            {/* Enhanced Search */}
            <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-white/40">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, lessons..."
                    className="w-full pl-12 pr-4 py-3 bg-transparent border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-5 w-5 text-gray-600" />
              </Button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <img
                  src={user?.avatar || "https://i.pravatar.cc/150?img=6"}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="hidden md:block">
                  <span className="text-sm font-bold text-gray-900">
                    {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                  </span>
                  <div className="text-xs text-gray-500">
                    {user?.role === 'LEARNER' ? 'Student' : user?.role || 'User'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/40">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">
                  Welcome back, {user?.firstName || 'Student'}! 
                  <span className="inline-block ml-2 animate-bounce">👋</span>
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  Ready to continue your journey to <span className="font-bold text-indigo-600">ENSP Yaoundé</span>?
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Fire className="h-4 w-4 text-orange-500" />
                    <span>7-day study streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span>3 goals completed this week</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>Rank #12 in your class</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className={`text-xs font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Recommendations */}
            <AIRecommendations className="border-0 shadow-lg bg-white/80 backdrop-blur-sm" />
            
            {/* Enhanced Continue Learning */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                      <p className="text-sm text-gray-600">Pick up where you left off</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="rounded-xl">
                    <Link to="/courses">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      
                      <div className="relative p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <BookOpen className="h-8 w-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                                {course.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {course.difficulty}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{course.subtitle}</p>
                            <p className="text-sm text-gray-500 mb-3">
                              {course.institution} • Next: {course.nextLesson}
                            </p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-bold text-gray-900">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            asChild
                            className={`bg-gradient-to-r ${course.color} hover:shadow-lg text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300`}
                          >
                            <Link to={`/lesson/${course.id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              Continue
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    <p className="text-sm text-gray-600">Your learning journey</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-300"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'quiz' ? 'bg-green-100' :
                        activity.type === 'lesson' ? 'bg-blue-100' :
                        activity.type === 'assignment' ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          <span className="font-bold">{activity.action}</span> {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      
                      {activity.score && (
                        <Badge className={`${
                          parseInt(activity.score) >= 90 ? 'bg-green-100 text-green-700' :
                          parseInt(activity.score) >= 80 ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        } font-semibold`}>
                          {activity.score}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Tests */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Tests</h2>
                    <p className="text-sm text-gray-600">Stay prepared</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {upcomingTests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                        test.importance === 'high' 
                          ? 'border-red-200 bg-red-50/50' 
                          : 'border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-semibold ${
                            test.importance === 'high' ? 'border-red-300 text-red-700' : 'border-gray-300 text-gray-700'
                          }`}
                        >
                          {test.type}
                        </Badge>
                        <span className={`text-sm font-bold ${
                          test.importance === 'high' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {test.date}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">
                        {test.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <span>{test.time}</span>
                        <span>{test.duration}</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full rounded-xl font-semibold"
                        onClick={() => {
                          const event = {
                            title: test.title,
                            start: new Date(),
                            end: new Date(Date.now() + 2 * 60 * 60 * 1000),
                            description: `Exam preparation: ${test.title}`
                          };
                          
                          const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}`;
                          
                          window.open(calendarUrl, '_blank');
                          alert('Study session added to calendar!');
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                    <p className="text-sm text-gray-600">Your milestones</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-300">
                      <div className={`w-12 h-12 ${achievement.bg} rounded-xl flex items-center justify-center`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {achievement.date}
                        </p>
                      </div>
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                    <p className="text-sm text-gray-600">Get things done</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start rounded-xl p-4 h-auto hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                  >
                    <Link to="/quiz">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Practice Test</div>
                        <div className="text-xs text-gray-500">Test your knowledge</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start rounded-xl p-4 h-auto hover:bg-green-50 hover:border-green-200 transition-all duration-300"
                  >
                    <Link to="/forums">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Study Forums</div>
                        <div className="text-xs text-gray-500">Connect with peers</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start rounded-xl p-4 h-auto hover:bg-purple-50 hover:border-purple-200 transition-all duration-300"
                  >
                    <Link to="/study-calendar">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Study Calendar</div>
                        <div className="text-xs text-gray-500">Plan your time</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start rounded-xl p-4 h-auto hover:bg-orange-50 hover:border-orange-200 transition-all duration-300"
                  >
                    <Link to="/profile">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Profile</div>
                        <div className="text-xs text-gray-500">Update settings</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced AI Assistant Floating Button */}
      <Button
        onClick={() => setShowAIAssistant(!showAIAssistant)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-2xl z-40 group"
        size="lg"
      >
        <div className="relative">
          <Brain className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </Button>

      {/* AI Assistant Component */}
      <AIAssistant 
        isOpen={showAIAssistant} 
        onToggle={() => setShowAIAssistant(!showAIAssistant)} 
      />
    </div>
  );
}
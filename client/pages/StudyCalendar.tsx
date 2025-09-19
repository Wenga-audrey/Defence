import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  Settings,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  Bell,
  Play,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  BarChart3,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function StudyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [availabilitySetup, setAvailabilitySetup] = useState(false);

  // Mock user availability and preferences
  const [userPreferences, setUserPreferences] = useState({
    studyHoursPerDay: 3,
    preferredTimes: ["morning", "evening"],
    examDate: "2025-06-15",
    targetExam: "ENSP",
    studyDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    breakDuration: 15,
    sessionDuration: 60,
  });

  // Mock study sessions and events with enhanced functionality
  const [studySessions, setStudySessions] = useState([
    {
      id: 1,
      title: "Mathematics Review",
      subject: "Advanced Calculus",
      date: "2025-01-20",
      time: "09:00",
      duration: 120,
      type: "study",
      status: "scheduled",
      priority: "high",
      reminder: true,
      notes: "Focus on integration techniques",
    },
    {
      id: 2,
      title: "Physics Practice",
      subject: "Thermodynamics",
      date: "2025-01-20",
      time: "14:00",
      duration: 90,
      type: "practice",
      status: "completed",
      priority: "medium",
      reminder: false,
      notes: "Complete practice problems 1-15",
    },
    {
      id: 3,
      title: "Mock Exam",
      subject: "ENSP Preparation",
      date: "2025-01-22",
      time: "10:00",
      duration: 180,
      type: "exam",
      status: "scheduled",
      priority: "high",
      reminder: true,
      notes: "Full simulation exam conditions",
    },
    {
      id: 4,
      title: "Economics Practice Test",
      subject: "Economics",
      examTarget: "ENAM",
      date: "2024-01-16",
      startTime: "15:30",
      endTime: "17:00",
      duration: 90,
      type: "test",
      status: "scheduled",
      progress: 0,
      aiGenerated: true,
      priority: "medium",
    },
    {
      id: 5,
      title: "Mock Exam - Full Paper",
      subject: "All Subjects",
      examTarget: "ENAM",
      date: "2024-01-17",
      startTime: "09:00",
      endTime: "12:00",
      duration: 180,
      type: "exam",
      status: "scheduled",
      progress: 0,
      aiGenerated: true,
      priority: "critical",
    },
  ]);

  // AI Study Analytics
  const studyAnalytics = {
    totalStudyHours: 127,
    completionRate: 78,
    averageScore: 85,
    weakAreas: ["Administrative Procedures", "International Relations"],
    strongAreas: ["Constitutional Law", "French"],
    recommendedFocus: "Increase Economics practice by 20%",
    nextMilestone: "Complete Mock Exam Series",
    streakDays: 12,
    efficiency: "High - 92%",
  };

  // Calendar generation
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(
        year,
        month - 1,
        new Date(year, month, 0).getDate() - i,
      );
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return studySessions.filter((session) => session.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return BookOpen;
      case "quiz":
        return Target;
      case "test":
        return CheckCircle;
      case "exam":
        return Star;
      default:
        return BookOpen;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-black mb-2">
                AI Study Calendar
              </h1>
              <p className="text-black/70">
                Personalized study schedule optimized for your{" "}
                {userPreferences.targetExam} exam preparation
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-mindboost-green/10 text-mindboost-green px-4 py-2">
                🧠 AI-Optimized Schedule
              </Badge>
              <Button
                onClick={() => setShowScheduleModal(true)}
                className="bg-mindboost-green hover:bg-mindboost-green/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            {/* Calendar Controls */}
            <Card className="border-0 shadow-sm mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() - 1,
                            1,
                          ),
                        )
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl font-bold text-black">
                      {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() + 1,
                            1,
                          ),
                        )
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("month")}
                    >
                      Month
                    </Button>
                    <Button
                      variant={viewMode === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("week")}
                    >
                      Week
                    </Button>
                    <Button
                      variant={viewMode === "day" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("day")}
                    >
                      Day
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center font-semibold text-black/60 text-sm"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {/* Calendar days */}
                  {generateCalendarDays().map((day, index) => {
                    const sessions = getSessionsForDate(day.date);
                    const isToday =
                      formatDate(day.date) === formatDate(new Date());
                    const isSelected =
                      formatDate(day.date) === formatDate(selectedDate);

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                          p-2 h-24 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                          ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                          ${isToday ? "ring-2 ring-mindboost-green" : ""}
                          ${isSelected ? "bg-mindboost-light-green" : ""}
                        `}
                      >
                        <div className="text-sm font-semibold mb-1">
                          {day.date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {sessions.slice(0, 2).map((session) => (
                            <div
                              key={session.id}
                              className={`text-xs p-1 rounded truncate border-l-2 ${getPriorityColor(session.priority)} ${getStatusColor(session.status)}`}
                            >
                              {session.title}
                            </div>
                          ))}
                          {sessions.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{sessions.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Day Sessions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h3 className="text-xl font-bold text-black">
                  Sessions for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getSessionsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No sessions scheduled for this day
                      </p>
                      <Button
                        className="mt-4 bg-mindboost-green hover:bg-mindboost-green/90"
                        onClick={() => setShowScheduleModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Session
                      </Button>
                    </div>
                  ) : (
                    getSessionsForDate(selectedDate).map((session) => {
                      const TypeIcon = getTypeIcon(session.type);
                      return (
                        <Card
                          key={session.id}
                          className={`border-l-4 ${getPriorityColor(session.priority)}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-mindboost-green/10 rounded-full flex items-center justify-center">
                                  <TypeIcon className="h-5 w-5 text-mindboost-green" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-black">
                                    {session.title}
                                  </h4>
                                  <p className="text-sm text-black/60">
                                    {session.subject}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={getStatusColor(session.status)}
                                >
                                  {session.status}
                                </Badge>
                                {session.aiGenerated && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Brain className="h-3 w-3 text-purple-500" />
                                    <span className="text-xs text-purple-600">
                                      AI Generated
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-black/70 mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {session.startTime} - {session.endTime}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="h-4 w-4" />
                                <span>{session.duration} min</span>
                              </div>
                              {session.progress > 0 && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>{session.progress}% complete</span>
                                </div>
                              )}
                            </div>

                            {session.status === "scheduled" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-mindboost-green hover:bg-mindboost-green/90"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Session
                                </Button>
                                <Button size="sm" variant="outline">
                                  Reschedule
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-bold text-black flex items-center">
                  <Brain className="h-5 w-5 text-purple-500 mr-2" />
                  AI Study Insights
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-black/70">Study Streak</span>
                    <span className="font-bold text-mindboost-green">
                      {studyAnalytics.streakDays} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-black/70">Efficiency</span>
                    <span className="font-bold text-blue-600">
                      {studyAnalytics.efficiency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/70">Avg Score</span>
                    <span className="font-bold text-green-600">
                      {studyAnalytics.averageScore}%
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-black mb-2">
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-black/70 mb-3">
                    {studyAnalytics.recommendedFocus}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Apply Suggestion
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Study Progress */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-bold text-black">
                  This Week's Progress
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Study Hours</span>
                      <span>18/21</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-mindboost-green h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sessions Complete</span>
                      <span>12/15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quiz Performance</span>
                      <span>87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-bold text-black">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-mindboost-green hover:bg-mindboost-green/90"
                  onClick={() => {
                    const newSession = {
                      id: studySessions.length + 1,
                      title: "New Study Session",
                      subject: "General",
                      examTarget: "ENSP",
                      date: new Date().toISOString().split('T')[0],
                      startTime: "14:00",
                      endTime: "16:00",
                      duration: 120,
                      type: "study",
                      status: "scheduled",
                      progress: 0,
                      aiGenerated: false,
                      priority: "medium",
                    };
                    setStudySessions([...studySessions, newSession]);
                    alert("Study session added to calendar!");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Study Session
                </Button>
                <Link to="/quiz">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Take Practice Quiz
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // AI-powered schedule optimization
                    const optimizedSessions = studySessions.map(session => ({
                      ...session,
                      startTime: session.priority === "high" ? "09:00" : session.startTime,
                      aiGenerated: true,
                      examTarget: session.examTarget || "ENSP",
                      endTime: session.endTime || "16:00",
                      progress: session.progress || 0
                    }));
                    setStudySessions(optimizedSessions);
                    alert("Schedule optimized using AI recommendations!");
                  }}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Optimize Schedule
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Apply AI suggestions
                    const suggestions = [
                      "Focus on weak areas: Mathematics",
                      "Increase study time by 30 minutes",
                      "Add review sessions before exams"
                    ];
                    alert(`AI Suggestions Applied:\n${suggestions.join('\n')}`);
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Apply AI Suggestions
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-bold text-black">
                  Upcoming Deadlines
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-semibold text-black">ENAM Exam</div>
                      <div className="text-sm text-red-600">
                        June 15, 2024 (150 days)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-semibold text-black">
                        Mock Exam Series
                      </div>
                      <div className="text-sm text-yellow-600">
                        March 1, 2024 (30 days)
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

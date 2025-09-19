import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Settings,
  LogOut,
  Brain,
} from "@/lib/icons";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const myCourses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      students: 145,
      institution: "ENSP Yaoundé",
      completion: 78,
      rating: 4.8,
      nextClass: "Today 2:00 PM",
    },
    {
      id: 2,
      title: "Physics - Mechanics",
      students: 89,
      institution: "ENSP Yaoundé",
      completion: 65,
      rating: 4.9,
      nextClass: "Tomorrow 10:00 AM",
    },
    {
      id: 3,
      title: "Technical Drawing",
      students: 67,
      institution: "ENSET Douala",
      completion: 92,
      rating: 4.7,
      nextClass: "Dec 28 3:00 PM",
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: "Advanced Calculus - Integration",
      course: "Advanced Mathematics",
      time: "Today 2:00 PM",
      duration: "90 minutes",
      students: 145,
      type: "Live Session",
    },
    {
      id: 2,
      title: "Thermodynamics Review",
      course: "Physics - Mechanics",
      time: "Tomorrow 10:00 AM",
      duration: "60 minutes",
      students: 89,
      type: "Q&A Session",
    },
    {
      id: 3,
      title: "3D Projections Workshop",
      course: "Technical Drawing",
      time: "Dec 28 3:00 PM",
      duration: "120 minutes",
      students: 67,
      type: "Workshop",
    },
  ];

  const recentSubmissions = [
    {
      student: "Marie Ngozi",
      assignment: "Calculus Problem Set 5",
      course: "Advanced Mathematics",
      submitted: "2 hours ago",
      status: "pending",
    },
    {
      student: "Jean Mbarga",
      assignment: "Physics Lab Report",
      course: "Physics - Mechanics",
      submitted: "5 hours ago",
      status: "graded",
    },
    {
      student: "Catherine Ndom",
      assignment: "Technical Drawing Project",
      course: "Technical Drawing",
      submitted: "1 day ago",
      status: "pending",
    },
  ];

  const stats = [
    {
      label: "Total Students",
      value: "301",
      icon: Users,
      change: "+12 this week",
    },
    {
      label: "Active Courses",
      value: "3",
      icon: BookOpen,
      change: "All on track",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      icon: Star,
      change: "+0.2 this month",
    },
    {
      label: "Completion Rate",
      value: "78%",
      icon: TrendingUp,
      change: "+5% this month",
    },
  ];

  const studentProgress = [
    {
      name: "Marie Ngozi",
      course: "Advanced Mathematics",
      progress: 95,
      grade: "A",
    },
    {
      name: "Jean Mbarga",
      course: "Physics - Mechanics",
      progress: 87,
      grade: "B+",
    },
    {
      name: "Catherine Ndom",
      course: "Technical Drawing",
      progress: 92,
      grade: "A-",
    },
    {
      name: "Paul Foka",
      course: "Advanced Mathematics",
      progress: 78,
      grade: "B",
    },
    {
      name: "Grace Tabi",
      course: "Physics - Mechanics",
      progress: 85,
      grade: "B+",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-mindboost-green rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-black">MindBoost</span>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                Instructor
              </Badge>
            </Link>

            {/* Search */}
            <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, assignments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PN</span>
                </div>
                <span className="hidden md:block text-sm font-semibold text-black">
                  Prof. Njoya
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-black mb-2">
            Good afternoon, Prof. Njoya! 👨‍🏫
          </h1>
          <p className="text-gray-600">
            You have 3 upcoming classes today and 8 assignments to review.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-black">
                      {stat.value}
                    </p>
                    <p className="text-xs text-mindboost-green font-semibold">
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-mindboost-green/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-mindboost-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-bold text-black">My Courses</h2>
                <Button
                  size="sm"
                  className="bg-mindboost-green hover:bg-mindboost-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Course
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {myCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-mindboost-green rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.institution}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {course.students} students
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">
                            {course.rating}
                          </span>
                        </div>
                        <span className="text-sm text-mindboost-green font-semibold">
                          {course.completion}% complete
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 font-semibold mt-1">
                        Next: {course.nextClass}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-bold text-black">
                  Recent Submissions
                </h2>
                <Button size="sm" variant="outline">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSubmissions.map((submission, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {submission.student
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-black">
                          {submission.student}
                        </p>
                        <p className="text-sm text-gray-600">
                          {submission.assignment}
                        </p>
                        <p className="text-xs text-gray-500">
                          {submission.course} • {submission.submitted}
                        </p>
                      </div>
                      <Badge
                        className={
                          submission.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {submission.status}
                      </Badge>
                      <Button size="sm">
                        {submission.status === "pending" ? "Review" : "View"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Progress */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  Student Progress Overview
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.map((student, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-mindboost-green rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-black">
                            {student.name}
                          </span>
                          <Badge className="bg-mindboost-green/10 text-mindboost-green">
                            {student.grade}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {student.course}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-mindboost-green h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-mindboost-green">
                              {student.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Classes */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  Upcoming Classes
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {classItem.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {classItem.time}
                      </span>
                    </div>
                    <h3 className="font-semibold text-black mb-1">
                      {classItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {classItem.course}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{classItem.duration}</span>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{classItem.students}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Class
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">Quick Actions</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-mindboost-green hover:bg-mindboost-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Grade Assignments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Students
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Course Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

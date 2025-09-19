import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Calendar,
  Trophy,
  Clock,
  Play,
  CheckCircle,
  Target,
  Award,
  BarChart3,
  User,
  Settings,
  Menu,
  X,
  ChevronRight,
  Star,
  MessageCircle,
  Bell,
  Search,
  LogOut,
  Brain,
} from "@/lib/icons";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const institutionClasses = [
    {
      id: 1,
      name: "ENSP Yaoundé - Mathematics",
      instructor: "Prof. Emmanuel Njoya",
      students: 145,
      capacity: 200,
      status: "active",
      revenue: "17,400,000 FCFA",
      startDate: "Jan 15, 2024",
    },
    {
      id: 2,
      name: "ENSP Yaoundé - Physics",
      instructor: "Prof. Marie Fotso",
      students: 89,
      capacity: 150,
      status: "active",
      revenue: "10,680,000 FCFA",
      startDate: "Jan 20, 2024",
    },
    {
      id: 3,
      name: "ENSET Douala - Technical Drawing",
      instructor: "Dr. Jean-Claude Mbarga",
      students: 67,
      capacity: 100,
      status: "active",
      revenue: "8,040,000 FCFA",
      startDate: "Feb 1, 2024",
    },
    {
      id: 4,
      name: "HICM - Business Mathematics",
      instructor: "Ms. Catherine Ndom",
      students: 120,
      capacity: 180,
      status: "pending",
      revenue: "0 FCFA",
      startDate: "Mar 1, 2024",
    },
  ];

  const instructors = [
    {
      id: 1,
      name: "Prof. Emmanuel Njoya",
      email: "e.njoya@mindboost.cm",
      specialization: "Mathematics",
      courses: 2,
      students: 234,
      rating: 4.9,
      status: "active",
    },
    {
      id: 2,
      name: "Prof. Marie Fotso",
      email: "m.fotso@mindboost.cm",
      specialization: "Physics",
      courses: 1,
      students: 89,
      rating: 4.8,
      status: "active",
    },
    {
      id: 3,
      name: "Dr. Jean-Claude Mbarga",
      email: "jc.mbarga@mindboost.cm",
      specialization: "Engineering",
      courses: 1,
      students: 67,
      rating: 4.7,
      status: "active",
    },
    {
      id: 4,
      name: "Ms. Catherine Ndom",
      email: "c.ndom@mindboost.cm",
      specialization: "Business",
      courses: 0,
      students: 0,
      rating: 0,
      status: "pending",
    },
  ];

  const recentEnrollments = [
    {
      student: "Marie Ngozi",
      class: "ENSP Yaoundé - Mathematics",
      amount: "120,000 FCFA",
      date: "2 hours ago",
    },
    {
      student: "Jean Mbarga",
      class: "ENSP Yaoundé - Physics",
      amount: "120,000 FCFA",
      date: "5 hours ago",
    },
    {
      student: "Catherine Tabi",
      class: "ENSET Douala - Technical Drawing",
      amount: "120,000 FCFA",
      date: "1 day ago",
    },
    {
      student: "Paul Foka",
      class: "ENSP Yaoundé - Mathematics",
      amount: "120,000 FCFA",
      date: "2 days ago",
    },
  ];

  const stats = [
    {
      label: "Total Students",
      value: "421",
      icon: Users,
      change: "+45 this month",
    },
    {
      label: "Active Classes",
      value: "8",
      icon: BookOpen,
      change: "+2 this month",
    },
    {
      label: "Total Revenue",
      value: "50.5M",
      icon: DollarSign,
      change: "+12% this month",
    },
    {
      label: "Success Rate",
      value: "94%",
      icon: Target,
      change: "+3% this month",
    },
  ];

  const institutions = [
    { name: "ENSP Yaoundé", classes: 3, students: 234, revenue: "28.1M FCFA" },
    { name: "ENSET Douala", classes: 2, students: 67, revenue: "8.0M FCFA" },
    { name: "HICM", classes: 2, students: 120, revenue: "14.4M FCFA" },
    { name: "FHS Bamenda", classes: 1, students: 0, revenue: "0 FCFA" },
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
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                Admin
              </Badge>
            </Link>

            {/* Search */}
            <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes, instructors..."
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
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                <span className="hidden md:block text-sm font-semibold text-black">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-black mb-2">
              Academy Administration 🏛️
            </h1>
            <p className="text-gray-600">
              Manage classes, assign instructors, and oversee student
              enrollments.
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/admin/classes">
              <Plus className="h-4 w-4 mr-2" /> Manage Classes
            </Link>
          </Button>
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
            {/* Institution Classes */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-bold text-black">
                  Institution Classes
                </h2>
                <Button className="bg-mindboost-green hover:bg-mindboost-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Class
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {institutionClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-black">
                            {classItem.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Instructor: {classItem.instructor}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge
                            className={
                              classItem.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {classItem.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Enrollment</p>
                          <p className="font-semibold text-black">
                            {classItem.students}/{classItem.capacity}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-mindboost-green h-2 rounded-full"
                              style={{
                                width: `${(classItem.students / classItem.capacity) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-semibold text-black">
                            {classItem.revenue}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-semibold text-black">
                            {classItem.startDate}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructors Management */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-bold text-black">Instructors</h2>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Instructor
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-mindboost-green rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">
                          {instructor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {instructor.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {instructor.specialization}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-black">
                          {instructor.courses} courses
                        </p>
                        <p className="text-sm text-gray-600">
                          {instructor.students} students
                        </p>
                        {instructor.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                              {instructor.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge
                        className={
                          instructor.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {instructor.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Enrollments */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  Recent Enrollments
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEnrollments.map((enrollment, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-mindboost-green rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {enrollment.student
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black text-sm">
                        {enrollment.student}
                      </p>
                      <p className="text-xs text-gray-600">
                        {enrollment.class}
                      </p>
                      <p className="text-xs text-gray-500">{enrollment.date}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {enrollment.amount}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Institution Overview */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  Institution Overview
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {institutions.map((institution, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <h3 className="font-semibold text-black mb-2">
                      {institution.name}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Classes:</span>
                        <span className="font-semibold">
                          {institution.classes}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Students:</span>
                        <span className="font-semibold">
                          {institution.students}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-semibold text-mindboost-green">
                          {institution.revenue}
                        </span>
                      </div>
                    </div>
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
                  Create New Class
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Instructor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
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

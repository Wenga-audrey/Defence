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
  Activity,
  UserCheck,
  Plus,
  Eye,
  Edit,
  Trash2,
  Globe,
  Shield,
  Database,
  Server,
  AlertTriangle,
} from "@/lib/icons";
import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const platformStats = [
    {
      label: "Total Users",
      value: "15,847",
      icon: Users,
      change: "+1,234 this month",
    },
    {
      label: "Total Revenue",
      value: "₣2.1B",
      icon: DollarSign,
      change: "+18% this month",
    },
    {
      label: "Active Admins",
      value: "24",
      icon: UserCheck,
      change: "+3 this month",
    },
    {
      label: "System Health",
      value: "99.9%",
      icon: Activity,
      change: "All systems operational",
    },
  ];

  const academyAdmins = [
    {
      id: 1,
      name: "Dr. Emmanuel Njoya",
      email: "admin@ensp-yaounde.mindboost.cm",
      institution: "ENSP Yaoundé Academy",
      students: 2834,
      revenue: "₣340M",
      status: "active",
      lastLogin: "2 hours ago",
    },
    {
      id: 2,
      name: "Prof. Marie Fotso",
      email: "admin@enset-douala.mindboost.cm",
      institution: "ENSET Douala Academy",
      students: 1567,
      revenue: "₣188M",
      status: "active",
      lastLogin: "5 hours ago",
    },
    {
      id: 3,
      name: "Dr. Jean Mbarga",
      email: "admin@hicm.mindboost.cm",
      institution: "HICM Academy",
      students: 3421,
      revenue: "₣410M",
      status: "active",
      lastLogin: "1 day ago",
    },
    {
      id: 4,
      name: "Ms. Catherine Ndom",
      email: "admin@fhs-bamenda.mindboost.cm",
      institution: "FHS Bamenda Academy",
      students: 892,
      revenue: "₣107M",
      status: "pending",
      lastLogin: "Never",
    },
  ];

  const systemMetrics = [
    { metric: "Server Uptime", value: "99.98%", status: "excellent" },
    { metric: "Response Time", value: "245ms", status: "good" },
    { metric: "Database Load", value: "67%", status: "normal" },
    { metric: "Storage Used", value: "2.3TB/10TB", status: "normal" },
    { metric: "Daily Backups", value: "Successful", status: "excellent" },
    { metric: "Security Scans", value: "Clean", status: "excellent" },
  ];

  const recentActivities = [
    {
      type: "admin_created",
      user: "Dr. Emmanuel Njoya",
      action: "Created new academy admin",
      time: "2 hours ago",
    },
    {
      type: "payment",
      user: "System",
      action: "Processed ₣2.5M in payments",
      time: "3 hours ago",
    },
    {
      type: "user_signup",
      user: "Marie Ngozi",
      action: "New student registration",
      time: "5 hours ago",
    },
    {
      type: "security",
      user: "System",
      action: "Security scan completed",
      time: "6 hours ago",
    },
    {
      type: "backup",
      user: "System",
      action: "Daily backup completed",
      time: "12 hours ago",
    },
  ];

  const globalStats = [
    { region: "Cameroon", users: 14234, revenue: "₣1.8B", growth: "+15%" },
    { region: "Nigeria", users: 892, revenue: "₣145M", growth: "+23%" },
    { region: "Chad", users: 456, revenue: "₣89M", growth: "+18%" },
    {
      region: "Central African Republic",
      users: 265,
      revenue: "₣67M",
      growth: "+12%",
    },
  ];

  const alerts = [
    {
      type: "warning",
      message: "High server load detected on EU-West-1",
      time: "30 minutes ago",
    },
    {
      type: "info",
      message: "New security update available",
      time: "2 hours ago",
    },
    {
      type: "success",
      message: "Backup completed successfully",
      time: "6 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-black">MindBoost</span>
              <Badge className="bg-red-100 text-red-800 text-xs">
                Super Admin
              </Badge>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search across all platforms..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 text-red-500" />
                <Badge className="ml-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SA</span>
                </div>
                <span className="hidden md:block text-sm font-semibold text-black">
                  Super Admin
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
            Platform Control Center 🌍
          </h1>
          <p className="text-gray-600">
            Monitor and manage the entire MindBoost platform ecosystem.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-black">
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-600 font-semibold">
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/10 to-purple-600/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academy Admins */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-bold text-black">
                  Academy Administrators
                </h2>
                <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Academy
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {academyAdmins.map((admin) => (
                    <div
                      key={admin.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-black">{admin.name}</h3>
                          <p className="text-sm text-gray-600">{admin.email}</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {admin.institution}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge
                            className={
                              admin.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {admin.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Students</p>
                          <p className="font-semibold text-black">
                            {admin.students.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-semibold text-green-600">
                            {admin.revenue}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Login</p>
                          <p className="font-semibold text-black">
                            {admin.lastLogin}
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

            {/* System Metrics */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  System Health Metrics
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-black">
                          {metric.metric}
                        </h3>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            metric.status === "excellent"
                              ? "bg-green-500"
                              : metric.status === "good"
                                ? "bg-blue-500"
                                : metric.status === "normal"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <p className="text-2xl font-black text-black">
                        {metric.value}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {metric.status}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Global Statistics */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  Global Performance
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {globalStats.map((region, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Globe className="h-8 w-8 text-red-500" />
                        <div>
                          <h3 className="font-semibold text-black">
                            {region.region}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {region.users.toLocaleString()} users
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">{region.revenue}</p>
                        <p className="text-sm text-green-600 font-semibold">
                          {region.growth}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* System Alerts */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">System Alerts</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg border"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === "warning"
                          ? "bg-yellow-500"
                          : alert.type === "info"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-black">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  Recent Activities
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "admin_created"
                          ? "bg-purple-100"
                          : activity.type === "payment"
                            ? "bg-green-100"
                            : activity.type === "user_signup"
                              ? "bg-blue-100"
                              : activity.type === "security"
                                ? "bg-red-100"
                                : "bg-gray-100"
                      }`}
                    >
                      {activity.type === "admin_created" && (
                        <UserCheck className="h-4 w-4 text-purple-600" />
                      )}
                      {activity.type === "payment" && (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "user_signup" && (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.type === "security" && (
                        <Shield className="h-4 w-4 text-red-600" />
                      )}
                      {activity.type === "backup" && (
                        <Database className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-black">{activity.action}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold text-black">
                  Platform Controls
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Academy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Server className="h-4 w-4 mr-2" />
                  Server Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
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

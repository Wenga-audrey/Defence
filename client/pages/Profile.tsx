import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Save,
  Settings,
  CreditCard,
  Download,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
} from "@/lib/icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "Marie",
    lastName: "Ngozi",
    email: "marie.ngozi@example.com",
    phone: "+237 6XX XXX XXX",
    targetInstitution: "ENSP Yaoundé (ENSPY)",
    bio: "Aspiring civil engineer passionate about sustainable infrastructure development.",
    location: "Yaoundé, Cameroon",
    dateOfBirth: "1998-03-15",
    emergencyContact: "+237 6YY YYY YYY",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: false,
    courseReminders: true,
    examNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showProgress: true,
    shareAchievements: true,
    allowMessaging: true,
  });

  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacy({
      ...privacy,
      [key]: value,
    });
  };

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "data", label: "Data & Export", icon: Download },
  ];

  const institutions = [
    "ENSP Yaoundé (ENSPY)",
    "ENSP Maroua",
    "ENSET Douala",
    "HICM",
    "FHS Bamenda",
    "ENSTP/NSPW",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green rounded-full flex items-center justify-center text-white font-bold text-2xl">
                MN
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-mindboost-green rounded-full flex items-center justify-center text-white hover:bg-mindboost-green/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-black text-black">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-black/70">{profileData.email}</p>
              <Badge className="bg-mindboost-green text-white mt-2">
                {profileData.targetInstitution}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-8">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left ${
                        activeTab === tab.id
                          ? "bg-mindboost-green text-white"
                          : "text-black/70 hover:bg-mindboost-green/10 hover:text-black"
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-semibold">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-black">
                      Profile Information
                    </h2>
                    <Button className="bg-mindboost-green hover:bg-mindboost-green/90 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Target Institution
                      </label>
                      <select
                        name="targetInstitution"
                        value={profileData.targetInstitution}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      >
                        {institutions.map((institution) => (
                          <option key={institution} value={institution}>
                            {institution}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-black mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-black mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-black mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-black mb-8">
                      Change Password
                    </h2>
                    <div className="space-y-6 max-w-md">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 pr-12 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 pr-12 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 pr-12 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <Button className="bg-mindboost-green hover:bg-mindboost-green/90 text-white">
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-black mb-6">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-mindboost-green/5 rounded-xl">
                      <div>
                        <p className="font-semibold text-black">
                          SMS Authentication
                        </p>
                        <p className="text-sm text-black/70">
                          Protect your account with SMS verification
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-mindboost-green text-mindboost-green"
                      >
                        Enable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-black mb-8">
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 border border-mindboost-green/20 rounded-xl"
                      >
                        <div>
                          <p className="font-semibold text-black capitalize">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </p>
                          <p className="text-sm text-black/70">
                            {key === "emailUpdates" &&
                              "Receive important updates via email"}
                            {key === "smsAlerts" &&
                              "Get urgent notifications via SMS"}
                            {key === "courseReminders" &&
                              "Reminders about upcoming lessons"}
                            {key === "examNotifications" &&
                              "Notifications about exam schedules"}
                            {key === "marketingEmails" &&
                              "Promotional content and offers"}
                            {key === "weeklyReports" &&
                              "Weekly progress summaries"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleNotificationChange(key)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mindboost-green"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-black mb-8">
                    Privacy Settings
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-4">
                        Profile Visibility
                      </h3>
                      <div className="space-y-3">
                        {["public", "students", "private"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option}
                              checked={privacy.profileVisibility === option}
                              onChange={(e) =>
                                handlePrivacyChange(
                                  "profileVisibility",
                                  e.target.value,
                                )
                              }
                              className="text-mindboost-green"
                            />
                            <span className="capitalize font-medium text-black">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-mindboost-green/20 rounded-xl">
                        <div>
                          <p className="font-semibold text-black">
                            Show Progress
                          </p>
                          <p className="text-sm text-black/70">
                            Allow others to see your learning progress
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacy.showProgress}
                            onChange={(e) =>
                              handlePrivacyChange(
                                "showProgress",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mindboost-green"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-mindboost-green/20 rounded-xl">
                        <div>
                          <p className="font-semibold text-black">
                            Share Achievements
                          </p>
                          <p className="text-sm text-black/70">
                            Allow achievements to be visible to others
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacy.shareAchievements}
                            onChange={(e) =>
                              handlePrivacyChange(
                                "shareAchievements",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mindboost-green"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-mindboost-green/20 rounded-xl">
                        <div>
                          <p className="font-semibold text-black">
                            Allow Messaging
                          </p>
                          <p className="text-sm text-black/70">
                            Let other students send you messages
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacy.allowMessaging}
                            onChange={(e) =>
                              handlePrivacyChange(
                                "allowMessaging",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mindboost-green"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-black mb-8">
                      Billing Information
                    </h2>
                    <div className="bg-mindboost-green/5 border border-mindboost-green/20 rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-black">
                            Current Plan: Premium
                          </h3>
                          <p className="text-black/70">
                            Access to all courses and features
                          </p>
                        </div>
                        <Badge className="bg-mindboost-green text-white">
                          Active
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-black">Payment Method</h4>
                        <div className="p-4 border border-mindboost-green/20 rounded-xl">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">
                                **** **** **** 1234
                              </p>
                              <p className="text-sm text-black/70">
                                Expires 12/25
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-black">Next Payment</h4>
                        <div className="p-4 border border-mindboost-green/20 rounded-xl">
                          <p className="font-semibold">150,000 FCFA</p>
                          <p className="text-sm text-black/70">
                            Due December 15, 2024
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-black mb-6">
                      Payment History
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          date: "Nov 15, 2024",
                          amount: "150,000 FCFA",
                          status: "Paid",
                        },
                        {
                          date: "Oct 15, 2024",
                          amount: "150,000 FCFA",
                          status: "Paid",
                        },
                        {
                          date: "Sep 15, 2024",
                          amount: "150,000 FCFA",
                          status: "Paid",
                        },
                      ].map((payment, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 border border-mindboost-green/20 rounded-xl"
                        >
                          <div>
                            <p className="font-semibold text-black">
                              {payment.amount}
                            </p>
                            <p className="text-sm text-black/70">
                              {payment.date}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-mindboost-green text-white">
                              {payment.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data & Export Tab */}
            {activeTab === "data" && (
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-black mb-8">
                      Data Export
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 border border-mindboost-green/20 rounded-xl">
                        <h3 className="text-lg font-bold text-black mb-3">
                          Download Your Data
                        </h3>
                        <p className="text-black/70 mb-4">
                          Export all your personal data, progress, and
                          achievements.
                        </p>
                        <Button className="bg-mindboost-green hover:bg-mindboost-green/90 text-white">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>

                      <div className="p-6 border border-mindboost-green/20 rounded-xl">
                        <h3 className="text-lg font-bold text-black mb-3">
                          Progress Report
                        </h3>
                        <p className="text-black/70 mb-4">
                          Generate a comprehensive report of your learning
                          progress.
                        </p>
                        <Button
                          variant="outline"
                          className="border-mindboost-green text-mindboost-green"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg border-red-200">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-red-600 mb-6">
                      Danger Zone
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-red-800 mb-2">
                            Delete Account
                          </h4>
                          <p className="text-red-700 mb-4">
                            Permanently delete your account and all associated
                            data. This action cannot be undone.
                          </p>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

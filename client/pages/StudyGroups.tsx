import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Users,
  Plus,
  Search,
  Send,
  BookOpen,
  Clock,
  Star,
  Settings,
  UserPlus,
  Video,
  Phone,
  MoreHorizontal,
  Bell,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function StudyGroups() {
  const [activeGroup, setActiveGroup] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const studyGroups = [
    {
      id: 1,
      name: "ENSP Mathematics",
      subject: "Mathematics",
      members: 24,
      lastActivity: "2 minutes ago",
      unreadCount: 3,
      avatar: "M",
      description: "Advanced calculus and algebra study group",
      isActive: true,
    },
    {
      id: 2,
      name: "Physics Masters",
      subject: "Physics",
      members: 18,
      lastActivity: "1 hour ago",
      unreadCount: 0,
      avatar: "P",
      description: "Thermodynamics and mechanics discussions",
      isActive: true,
    },
    {
      id: 3,
      name: "ENAM Prep 2025",
      subject: "General",
      members: 45,
      lastActivity: "3 hours ago",
      unreadCount: 7,
      avatar: "E",
      description: "Complete ENAM examination preparation",
      isActive: true,
    },
    {
      id: 4,
      name: "Chemistry Lab",
      subject: "Chemistry",
      members: 12,
      lastActivity: "1 day ago",
      unreadCount: 0,
      avatar: "C",
      description: "Organic and inorganic chemistry help",
      isActive: false,
    },
  ];

  const messages = [
    {
      id: 1,
      user: "Marie Nkomo",
      avatar: "MN",
      message: "Can someone help me with integration by parts? I'm stuck on problem 15.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      user: "You",
      avatar: "YU",
      message: "Sure! Let me share the step-by-step approach. First, identify u and dv...",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      user: "Jean Mballa",
      avatar: "JM",
      message: "Great explanation! Here's a helpful video link: https://example.com/integration",
      timestamp: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      user: "Sarah Fon",
      avatar: "SF",
      message: "Thanks everyone! This group is so helpful 🙏",
      timestamp: "10:40 AM",
      isOwn: false,
    },
    {
      id: 5,
      user: "You",
      avatar: "YU",
      message: "Happy to help! Let's schedule a group study session for tomorrow.",
      timestamp: "10:42 AM",
      isOwn: true,
    },
  ];

  const activeGroupData = studyGroups.find(g => g.id === activeGroup);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement actual message sending
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-mindboost-green to-mindboost-dark-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-4">Study Groups & Chat</h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with fellow students and learn together
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8 h-[600px]">
          {/* Groups Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-black">Study Groups</h2>
                  <Button
                    onClick={() => setShowCreateGroup(true)}
                    size="sm"
                    className="bg-mindboost-green hover:bg-mindboost-green/90 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search groups..."
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {studyGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setActiveGroup(group.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        activeGroup === group.id ? "bg-mindboost-green/10 border-r-2 border-mindboost-green" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-mindboost-green rounded-full flex items-center justify-center text-white font-bold">
                          {group.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-black text-sm truncate">
                              {group.name}
                            </h3>
                            {group.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {group.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{group.members} members</span>
                            <span>{group.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-mindboost-green rounded-full flex items-center justify-center text-white font-bold">
                      {activeGroupData?.avatar}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-black">
                        {activeGroupData?.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {activeGroupData?.members} members • {activeGroupData?.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex space-x-3 max-w-xs lg:max-w-md ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                        {message.avatar}
                      </div>
                      <div>
                        <div className={`p-3 rounded-lg ${
                          message.isOwn 
                            ? "bg-mindboost-green text-white" 
                            : "bg-gray-100 text-black"
                        }`}>
                          {!message.isOwn && (
                            <p className="text-xs font-semibold mb-1 opacity-70">
                              {message.user}
                            </p>
                          )}
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-3">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-mindboost-green hover:bg-mindboost-green/90 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-black mb-2">Virtual Study Sessions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Join live video study sessions with your group members
              </p>
              <Button variant="outline" className="w-full">
                Schedule Session
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-black mb-2">Shared Resources</h3>
              <p className="text-sm text-gray-600 mb-4">
                Access notes, documents, and study materials shared by group members
              </p>
              <Button variant="outline" className="w-full">
                View Resources
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-black mb-2">Find Study Partners</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect with students preparing for the same exams
              </p>
              <Button variant="outline" className="w-full">
                Find Partners
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

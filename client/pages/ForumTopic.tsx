import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Users,
  Clock,
  ThumbsUp,
  Pin,
  ArrowLeft,
  Reply,
  Send,
  User,
  Award,
  CheckCircle,
  Heart,
  Share,
  Bookmark,
  Flag,
  MoreHorizontal,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForumTopic() {
  const { topicId } = useParams();
  const [newReply, setNewReply] = useState("");
  const [replies, setReplies] = useState([
    {
      id: 1,
      author: "Dr. Jean Mballa",
      role: "Instructor",
      avatar: "https://i.pravatar.cc/150?img=10",
      content: "Great question! For integration by parts, remember the formula: ∫u dv = uv - ∫v du. The key is choosing the right u and dv. Try using LIATE rule: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.",
      timestamp: "2 hours ago",
      likes: 5,
      isInstructor: true,
      isLiked: false,
      isHelpful: true,
    },
    {
      id: 2,
      author: "Marie K.",
      role: "Student",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "Thank you Dr. Mballa! That LIATE rule is really helpful. I was struggling with choosing u and dv correctly. Could you provide a specific example?",
      timestamp: "1 hour ago",
      likes: 2,
      isInstructor: false,
      isLiked: true,
      isHelpful: false,
    },
    {
      id: 3,
      author: "Paul N.",
      role: "Student", 
      avatar: "https://i.pravatar.cc/150?img=4",
      content: "I have a similar question about integration by substitution. Should I create a new topic or can we discuss it here? Also, does anyone have good practice problems?",
      timestamp: "45 minutes ago",
      likes: 1,
      isInstructor: false,
      isLiked: false,
      isHelpful: false,
    },
    {
      id: 4,
      author: "Dr. Jean Mballa",
      role: "Instructor",
      avatar: "https://i.pravatar.cc/150?img=10",
      content: "@Paul N. Feel free to ask here if it's related to integration techniques. For completely different topics, a new thread would be better for organization. I'll share some practice problems in my next response.",
      timestamp: "30 minutes ago",
      likes: 3,
      isInstructor: true,
      isLiked: false,
      isHelpful: true,
    }
  ]);

  // Mock topic data
  const topic = {
    id: parseInt(topicId || "1"),
    title: "Help with Calculus Integration Techniques",
    author: "Marie K.",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    category: "Mathematics",
    content: "I'm struggling with integration by parts and partial fractions. Can someone explain the step-by-step process? I have an exam coming up and these topics are really confusing me. Any tips or resources would be greatly appreciated!\n\nSpecifically, I'm having trouble with:\n1. Choosing the right substitution for u and dv\n2. When to use partial fractions vs integration by parts\n3. Complex fractions with multiple terms\n\nAny help would be amazing! 🙏",
    replies: replies.length,
    views: 89,
    lastActivity: "30 minutes ago",
    isPinned: false,
    createdAt: "3 hours ago",
    likes: 8,
    isLiked: false,
    isBookmarked: false,
    tags: ["calculus", "integration", "help", "exam-prep"],
  };

  const handleSubmitReply = () => {
    if (!newReply.trim()) return;

    const reply = {
      id: replies.length + 1,
      author: "You",
      role: "Student",
      avatar: "https://i.pravatar.cc/150?img=6",
      content: newReply,
      timestamp: "Just now",
      likes: 0,
      isInstructor: false,
      isLiked: false,
      isHelpful: false,
    };

    setReplies([...replies, reply]);
    setNewReply("");
  };

  const handleLikeReply = (replyId: number) => {
    setReplies(replies.map(reply => 
      reply.id === replyId 
        ? { ...reply, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1, isLiked: !reply.isLiked }
        : reply
    ));
  };

  const handleLikeTopic = () => {
    // Handle topic like logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Breadcrumb Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <Link to="/forums">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forums
              </Link>
            </Button>
            <div className="text-gray-400">/</div>
            <Badge variant="outline" className="text-indigo-600 border-indigo-200">
              {topic.category}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced Topic Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2"></div>
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  {topic.isPinned && <Pin className="h-5 w-5 text-indigo-500" />}
                  <h1 className="text-3xl font-black text-gray-900 leading-tight">{topic.title}</h1>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={topic.authorAvatar}
                      alt={`${topic.author} avatar`}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div>
                      <span className="font-semibold text-gray-900">{topic.author}</span>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{topic.createdAt}</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-3">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                    <Reply className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-blue-700">{topic.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-green-700">{topic.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-red-50 px-3 py-1 rounded-full">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-700">{topic.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {topic.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLikeTopic}
                  className={`rounded-full px-4 py-2 transition-all duration-300 ${
                    topic.isLiked 
                      ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" 
                      : "hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${topic.isLiked ? "fill-current" : ""}`} />
                  Like ({topic.likes})
                </Button>
                
                <Button variant="outline" size="sm" className="rounded-full px-4 py-2">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                
                <Button variant="outline" size="sm" className="rounded-full px-4 py-2">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                <Button variant="outline" size="sm" className="rounded-full px-4 py-2">
                  <Bookmark className={`h-4 w-4 mr-2 ${topic.isBookmarked ? "fill-current" : ""}`} />
                  Save
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Replies Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Replies ({replies.length})
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-sm">
                  Sort by: Most Helpful
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {replies.map((reply, index) => (
              <div 
                key={reply.id} 
                className={`border-b border-gray-100 last:border-b-0 p-6 transition-all duration-300 hover:bg-gray-50/50 ${
                  reply.isInstructor ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={reply.avatar}
                        alt={`${reply.author} avatar`}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                        style={{ width: "48px", height: "48px" }}
                      />
                      {reply.isInstructor && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-bold text-gray-900">{reply.author}</span>
                      {reply.isInstructor && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                          <Award className="h-3 w-3 mr-1" />
                          Instructor
                        </Badge>
                      )}
                      {reply.isHelpful && (
                        <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Helpful
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">{reply.timestamp}</span>
                    </div>
                    
                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700 leading-relaxed">{reply.content}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLikeReply(reply.id)}
                          className={`rounded-full px-3 py-1 transition-all duration-300 ${
                            reply.isLiked 
                              ? "bg-red-50 text-red-600 hover:bg-red-100" 
                              : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${reply.isLiked ? "fill-current" : ""}`} />
                          {reply.likes}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full px-3 py-1"
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-full px-3 py-1"
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced Reply Form */}
            <div className="p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <img
                  src="https://i.pravatar.cc/150?img=6"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  style={{ width: "40px", height: "40px" }}
                />
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-3">Add Your Reply</h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] transition-all duration-300"
                        placeholder="Share your thoughts, ask follow-up questions, or provide additional help..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {newReply.length}/1000
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-500">
                          💡 Be respectful and constructive in your responses
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl px-4 py-2"
                        >
                          Save Draft
                        </Button>
                        <Button
                          onClick={handleSubmitReply}
                          disabled={!newReply.trim()}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
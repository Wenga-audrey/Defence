import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Plus, MessageCircle, ThumbsUp, Pin, Eye, Reply } from '../lib/icons';

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  replies: number;
  likes: number;
  views: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  hasNewReplies: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Forums() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({ title: '', content: '', category: 'General' });
  const [replyContent, setReplyContent] = useState('');

  const categories = [
    "all",
    "Mathematics",
    "Physics", 
    "Chemistry",
    "Biology",
    "French",
    "English",
    "General",
  ];

  // Fetch topics from API
  useEffect(() => {
    fetchTopics();
  }, [activeCategory, searchQuery]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`${API_URL}/api/forums?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTopics(data.data.topics);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/forums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTopic)
      });
      
      const data = await response.json();
      if (data.success) {
        setShowNewTopicModal(false);
        setNewTopic({ title: '', content: '', category: 'General' });
        fetchTopics();
      }
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const handleLikeTopic = async (topicId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/forums/${topicId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchTopics();
      }
    } catch (error) {
      console.error('Failed to like topic:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Study <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Forums</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with fellow students and instructors. Ask questions, share knowledge, and learn together.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 bg-white/80 backdrop-blur-sm shadow-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <h3 className="font-bold text-gray-900 text-lg">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowNewTopicModal(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Discussion
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <h3 className="font-bold text-gray-900 text-lg">Categories</h3>
              </CardHeader>
              <CardContent className="p-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-all duration-300 ${
                      activeCategory === category ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-r-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className={`font-semibold ${
                            activeCategory === category ? "text-blue-700" : "text-gray-700"
                          }`}>
                            {category}
                          </span>
                          <div className="text-xs text-gray-500">
                            {topics.filter(topic => category === 'all' || topic.category === category).length} topics
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          activeCategory === category ? "bg-blue-100 text-blue-700" : ""
                        }`}
                      >
                        {topics.filter(topic => category === 'all' || topic.category === category).length}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{topics.length}</div>
                      <div className="text-emerald-100 text-sm">Active Topics</div>
                    </div>
                    <MessageCircle className="h-8 w-8 text-emerald-200" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{topics.reduce((sum, topic) => sum + topic.replies, 0)}</div>
                      <div className="text-emerald-100 text-sm">Total Replies</div>
                    </div>
                    <Reply className="h-8 w-8 text-emerald-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeCategory === "all" ? "All Discussions" : activeCategory}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {topics.length} active discussions
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowNewTopicModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Topic
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading discussions...</p>
                  </div>
                ) : topics.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No discussions found</p>
                    <p className="text-gray-400 mt-2">Be the first to start a conversation!</p>
                  </div>
                ) : (
                  topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="border-b border-gray-100 last:border-b-0 p-6 hover:bg-gray-50 transition-all duration-300"
                    >
                      <Link to={`/forum/${topic.id}`} className="block">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {topic.isPinned && (
                                    <Pin className="h-4 w-4 text-blue-500" />
                                  )}
                                  <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-lg">
                                    {topic.title}
                                  </h3>
                                  {topic.hasNewReplies && (
                                    <Badge className="bg-red-500 text-white text-xs px-2 py-1">New</Badge>
                                  )}
                                </div>
                                
                                <p className="text-gray-600 mb-3 line-clamp-2">
                                  {topic.content.substring(0, 150)}...
                                </p>
                                
                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium text-gray-700">by {topic.author}</span>
                                    {topic.authorRole === 'INSTRUCTOR' && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        Instructor
                                      </Badge>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {topic.category}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-3">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                                <Reply className="h-3 w-3 text-blue-500" />
                                <span className="font-semibold text-blue-700">{topic.replies}</span>
                              </div>
                              <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                                <Eye className="h-3 w-3 text-green-500" />
                                <span className="font-semibold text-green-700">{topic.views}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLikeTopic(topic.id);
                                }}
                                className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full p-2"
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span className="ml-1 text-xs">{topic.likes}</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedTopic(topic.id);
                                  setShowReplyModal(true);
                                }}
                                className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full p-2"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Topic Modal */}
        <Dialog open={showNewTopicModal} onOpenChange={setShowNewTopicModal}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Start New Discussion
              </DialogTitle>
              <p className="text-gray-600">
                Share your thoughts, ask questions, or start a conversation with the community.
              </p>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discussion Title
                </label>
                <Input
                  placeholder="Enter a clear, descriptive title..."
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <Select 
                  value={newTopic.category} 
                  onValueChange={(value) => setNewTopic({ ...newTopic, category: value })}
                >
                  <SelectTrigger className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 text-lg">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== "all").map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <Textarea
                  placeholder="Write your discussion content here. Be clear and provide context..."
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 min-h-[150px] text-lg resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTopic}
                  disabled={!newTopic.title || !newTopic.content}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Discussion
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reply Modal */}
        <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
                Reply to Discussion
              </DialogTitle>
              <p className="text-gray-600">
                Share your thoughts and contribute to the conversation.
              </p>
            </DialogHeader>
            <div className="space-y-4 mt-6">
              <Textarea
                placeholder="Write your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 min-h-[120px] text-lg resize-none"
              />
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReplyModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    console.log('Reply:', replyContent);
                    setShowReplyModal(false);
                    setReplyContent('');
                  }}
                  disabled={!replyContent}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Reply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

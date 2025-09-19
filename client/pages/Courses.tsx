import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  Award,
  Target,
  Grid3X3,
  Menu,
  TrendingUp,
  Zap,
  Brain,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Mock courses data with multiple subjects
  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      description: "Master calculus, algebra, and statistics with comprehensive problem-solving techniques",
      category: "Mathematics",
      examType: "ENSP",
      level: "Advanced",
      duration: 120,
      lessons: 45,
      enrolled: 1250,
      rating: 4.8,
      price: 25000,
      instructor: "Dr. Jean Mballa",
      thumbnail: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxtYXRoZW1hdGljcyUyMGdlb21ldHJ5JTIwZXF1YXRpb25zJTIwZ3JhcGhzJTIwZWR1Y2F0aW9ufGVufDB8MHx8Ymx1ZXwxNzU2Mjc3MzM4fDA&ixlib=rb-4.1.0&q=85",
      progress: 75,
      isEnrolled: true,
      difficulty: "Advanced",
      tags: ["Calculus", "Algebra", "Statistics"],
    },
    {
      id: 2,
      title: "General Physics",
      description: "Explore mechanics, thermodynamics, and electromagnetism through interactive simulations",
      category: "Physics",
      examType: "ENSP",
      level: "Intermediate",
      duration: 100,
      lessons: 38,
      enrolled: 980,
      rating: 4.7,
      price: 22000,
      instructor: "Prof. Marie Tchoumi",
      thumbnail: "https://images.unsplash.com/photo-1612343267229-d0b68e2dcc4f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxwaHlzaWNzJTIwbGFib3JhdG9yeSUyMGF0b21zJTIwc2NpZW5jZSUyMGVxdWlwbWVudHxlbnwwfDB8fHB1cnBsZXwxNzU2Mjc3MzM4fDA&ixlib=rb-4.1.0&q=85",
      progress: 0,
      isEnrolled: false,
      difficulty: "Intermediate",
      tags: ["Mechanics", "Thermodynamics", "Electromagnetism"],
    },
    {
      id: 3,
      title: "Organic Chemistry",
      description: "Deep dive into reaction mechanisms, synthesis, and molecular structures",
      category: "Chemistry",
      examType: "ENSP",
      level: "Advanced",
      duration: 90,
      lessons: 32,
      enrolled: 750,
      rating: 4.6,
      price: 20000,
      instructor: "Dr. Paul Nkomo",
      thumbnail: "https://images.unsplash.com/photo-1573871014706-263f4dfec410?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBtb2xlY3VsZXMlMjBsYWJvcmF0b3J5JTIwcGVyaW9kaWMlMjB0YWJsZSUyMHNjaWVuY2V8ZW58MHwwfHxncmVlbnwxNzU2Mjc3MzM4fDA&ixlib=rb-4.1.0&q=85",
      progress: 0,
      isEnrolled: false,
      difficulty: "Advanced",
      tags: ["Organic", "Reactions", "Synthesis"],
    },
    {
      id: 4,
      title: "Cell Biology & Genetics",
      description: "Modern biology covering cell structure, genetics, and molecular biology",
      category: "Biology",
      examType: "ENS",
      level: "Intermediate",
      duration: 85,
      lessons: 30,
      enrolled: 650,
      rating: 4.5,
      price: 18000,
      instructor: "Dr. Grace Fomba",
      thumbnail: "https://images.unsplash.com/photo-1660354862177-be804093dbf0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxjaGVtaXN0cnklMjBtb2xlY3VsZXMlMjBsYWJvcmF0b3J5JTIwcGVyaW9kaWMlMjB0YWJsZSUyMHNjaWVuY2V8ZW58MHwwfHxncmVlbnwxNzU2Mjc3MzM4fDA&ixlib=rb-4.1.0&q=85",
      progress: 0,
      isEnrolled: false,
      difficulty: "Intermediate",
      tags: ["Cell Biology", "Genetics", "Molecular"],
    },
    {
      id: 5,
      title: "French Literature & Grammar",
      description: "Advanced French language, literature analysis, and composition",
      category: "French",
      examType: "ENS",
      level: "Advanced",
      duration: 75,
      lessons: 28,
      enrolled: 850,
      rating: 4.4,
      price: 15000,
      instructor: "Prof. Sylvie Kamga",
      thumbnail: "https://images.unsplash.com/photo-1584609554957-2f40a8719b9a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxtYXRoZW1hdGljcyUyMGdlb21ldHJ5JTIwZXF1YXRpb25zJTIwZ3JhcGhzJTIwZWR1Y2F0aW9ufGVufDB8MHx8Ymx1ZXwxNzU2Mjc3MzM4fDA&ixlib=rb-4.1.0&q=85",
      progress: 0,
      isEnrolled: false,
      difficulty: "Advanced",
      tags: ["Literature", "Grammar", "Composition"],
    },
    {
      id: 6,
      title: "English Language & Literature",
      description: "Comprehensive English course for competitive exams",
      category: "English",
      examType: "ENAM",
      level: "Intermediate",
      duration: 70,
      lessons: 25,
      enrolled: 720,
      rating: 4.3,
      price: 14000,
      instructor: "Dr. John Asanji",
      thumbnail: "https://images.unsplash.com/photo-1486927181919-3ac1fc3a8082?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw5fHxtYXRoZW1hdGljcyUyMGdlb21ldHJ5JTIwZXF1YXRpb25zJTIwZ3JhcGhzJTIwZWR1Y2F0aW9ufGVufDB8MHx8Ymx1ZXwxNzU2Mjc3MzM4fDA&ixlib=rb-4.1.0&q=85",
      progress: 0,
      isEnrolled: false,
      difficulty: "Intermediate",
      tags: ["Language", "Literature", "Writing"],
    },
  ];

  const categories = [
    "all",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Languages",
    "Computer Science",
    "Biology",
    "Economics",
  ];

  const examTypes = ["All", "ENSP", "ENS", "ENAM", "Police", "Customs"];

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory]);

  const handleEnroll = async (courseId: number) => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ courseId })
      });
      
      if (response.ok) {
        alert('Successfully enrolled in course!');
        window.location.reload();
      } else {
        alert('Failed to enroll. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Enrollment failed. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Hero Section with Modern Design */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Unlock Your Potential
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Master Every
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Subject
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your learning journey with our comprehensive course library designed for academic excellence
            </p>
            
            {/* Enhanced Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-2">
                  <div className="flex items-center">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search courses, subjects, or instructors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 pr-6 py-4 text-lg bg-transparent border-0 text-white placeholder-white/70 focus:ring-0 focus:outline-none"
                    />
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold">
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Expert Instructors", value: "50+", icon: Award },
                { label: "Active Students", value: "10K+", icon: Users },
                { label: "Course Hours", value: "500+", icon: Clock },
                { label: "Success Rate", value: "95%", icon: TrendingUp },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Modern Filters */}
        <div className="flex flex-wrap items-center justify-between mb-12 gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">Filter by Subject</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                      : "border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:scale-105"
                  }`}
                >
                  {category === "all" ? "All Subjects" : category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-gray-600 font-medium">View:</span>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <Button
                onClick={() => setViewMode("grid")}
                variant="ghost"
                size="sm"
                className={`rounded-lg px-4 py-2 ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                variant="ghost"
                size="sm"
                className={`rounded-lg px-4 py-2 ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Course Grid/List with Modern Cards */}
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-8"
          }
        >
          {filteredCourses.map((course, index) => (
            <Card
              key={course.id}
              className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm ${
                viewMode === "list" ? "flex" : ""
              } ${index % 3 === 0 ? "lg:scale-105" : ""}`}
            >
              <div className={`relative ${viewMode === "list" ? "flex-shrink-0 w-80" : ""}`}>
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "h-full" : "h-56"
                  }`}
                >
                  <img
                    src={course.thumbnail}
                    alt={`${course.title} - ${course.description}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full font-semibold">
                      {course.examType}
                    </Badge>
                    <Badge className="bg-white/90 text-gray-800 px-3 py-1 rounded-full font-semibold">
                      {course.level}
                    </Badge>
                  </div>

                  {/* Progress indicator for enrolled courses */}
                  {course.isEnrolled && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <div className="flex justify-between text-white text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">{course.duration}h</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">{course.enrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{course.rating}</span>
                  </div>
                </div>

                {/* Instructor & Price */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-semibold text-gray-900">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {course.price.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {course.isEnrolled ? (
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to={`/lesson/${course.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEnroll(course.id)}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl px-4 transition-all duration-300"
                  >
                    <Link to={`/course/${course.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or explore different subject categories
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Show All Courses
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
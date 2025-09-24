import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  BookOpen,
  FileText,
  Target,
  CheckCircle,
  Clock,
  Brain,
  Lightbulb,
  MessageCircle,
  Download,
  Share,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  Zap,
  Award,
  TrendingUp,
  Settings,
  Eye,
  Users,
  Activity,
} from "@/lib/icons";
import { Link, useNavigate } from "react-router-dom";

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes example
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState<number[]>([]);
  const [userNotes, setUserNotes] = useState("");
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock lesson data
  const lessonData = {
    id: "admin-law-1",
    title: "Administrative Law: Fundamental Principles",
    subject: "Administrative Law",
    examTarget: "ENAM",
    instructor: "Prof. Emmanuel Njoya",
    duration: 600, // 10 minutes
    difficulty: "Intermediate",
    description: "Understanding the core principles of administrative law in Cameroon",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsYXd8ZW58MHwwfHx8MTY5ODc2NzI4MHww&ixlib=rb-4.1.0&q=85",
    learningObjectives: [
      "Define administrative law and its scope",
      "Understand the principles of public administration",
      "Identify key administrative institutions in Cameroon",
      "Analyze administrative decision-making processes",
    ],
    slides: [
      {
        id: 1,
        title: "Introduction to Administrative Law",
        content: "Administrative law governs the exercise of power by administrative agencies and the relationship between citizens and the state.",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rc3xlbnwwfDB8fHwxNjk4NzY3Mjgw&ixlib=rb-4.1.0&q=85",
        timeStamp: 0,
        keyPoints: ["Definition", "Scope", "Importance"],
      },
      {
        id: 2,
        title: "Sources of Administrative Law",
        content: "The constitution, statutes, regulations, and judicial decisions form the foundation of administrative law.",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rc3xlbnwwfDB8fHwxNjk4NzY3Mjgw&ixlib=rb-4.1.0&q=85",
        timeStamp: 120,
        keyPoints: ["Constitutional provisions", "Legislative acts", "Regulatory framework"],
      },
      {
        id: 3,
        title: "Administrative Institutions",
        content: "Key institutions include ministries, public enterprises, and regulatory authorities.",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rc3xlbnwwfDB8fHwxNjk4NzY3Mjgw&ixlib=rb-4.1.0&q=85",
        timeStamp: 240,
        keyPoints: ["Central administration", "Decentralized services", "Public enterprises"],
      },
      {
        id: 4,
        title: "Principles of Good Administration",
        content: "Legality, proportionality, and fairness are fundamental principles governing administrative action.",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rc3xlbnwwfDB8fHwxNjk4NzY3Mjgw&ixlib=rb-4.1.0&q=85",
        timeStamp: 360,
        keyPoints: ["Legality principle", "Proportionality", "Due process"],
      },
      {
        id: 5,
        title: "Administrative Procedures",
        content: "Proper procedures ensure transparency and accountability in administrative decision-making.",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rc3xlbnwwfDB8fHwxNjk4NzY3Mjgw&ixlib=rb-4.1.0&q=85",
        timeStamp: 480,
        keyPoints: ["Decision-making process", "Public consultation", "Appeal mechanisms"],
      },
    ],
    transcript: [
      {
        time: 0,
        speaker: "Prof. Njoya",
        text: "Welcome to this lesson on Administrative Law. Today we'll explore the fundamental principles that govern public administration in Cameroon.",
      },
      {
        time: 15,
        speaker: "Prof. Njoya",
        text: "Administrative law is the body of law that governs the activities of administrative agencies of government.",
      },
      {
        time: 30,
        speaker: "Prof. Njoya",
        text: "It encompasses the creation, operation, and legal relationships of administrative agencies with citizens and other governmental bodies.",
      },
    ],
    quizzes: [
      {
        id: 1,
        timeStamp: 180,
        question: "What is the primary source of administrative law in Cameroon?",
        options: ["The Constitution", "Ministerial decrees", "Court decisions", "International treaties"],
        correctAnswer: 0,
        explanation: "The Constitution is the supreme law and primary source of administrative law, establishing the framework for public administration.",
      },
      {
        id: 2,
        timeStamp: 420,
        question: "Which principle requires that administrative actions be based on legal authority?",
        options: ["Proportionality", "Legality", "Efficiency", "Transparency"],
        correctAnswer: 1,
        explanation: "The principle of legality requires that all administrative actions must have a legal basis and be within the scope of delegated authority.",
      },
    ],
    prerequisites: ["Introduction to Law", "Constitutional Law Basics"],
    nextLesson: "Administrative Procedures and Due Process",
    relatedLessons: ["Constitutional Law Overview", "Public Service Ethics"],
    estimatedStudyTime: "15-20 minutes",
    aiInsights: {
      difficulty: "This lesson is at intermediate level",
      focusAreas: ["Legal terminology", "Case law examples"],
      studyTips: ["Take notes on key principles", "Review constitutional provisions"],
      commonMistakes: ["Confusing administrative and constitutional law", "Missing procedure requirements"],
    },
  };

  // Progress tracking and completion detection
  useEffect(() => {
    const progress = (currentTime / duration) * 100;
    setLessonProgress(progress);

    if (progress >= 95 && !lessonCompleted) {
      setLessonCompleted(true);
      setShowCompletionModal(true);
      setIsPlaying(false);
    }
  }, [currentTime, duration, lessonCompleted]);

  // Auto-advance slides based on video time
  useEffect(() => {
    const currentSlideIndex = lessonData.slides.findIndex((slide, index) => {
      const nextSlide = lessonData.slides[index + 1];
      return (
        currentTime >= slide.timeStamp &&
        (!nextSlide || currentTime < nextSlide.timeStamp)
      );
    });

    if (currentSlideIndex !== -1 && currentSlideIndex !== currentSlide) {
      setCurrentSlide(currentSlideIndex);
    }
  }, [currentTime, currentSlide]);

  // Check for quiz triggers
  useEffect(() => {
    const quiz = lessonData.quizzes.find(
      (q) => Math.abs(currentTime - q.timeStamp) < 2 && !userAnswers[q.id],
    );

    if (quiz && isPlaying) {
      setIsPlaying(false);
      setQuizMode(true);
      setCurrentQuiz(quiz.id);
    }
  }, [currentTime, isPlaying, userAnswers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const handleQuizAnswer = (questionId: number, answer: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setTimeout(() => {
      setQuizMode(false);
      setIsPlaying(true);
    }, 2000);
  };

  const toggleBookmark = (timeStamp: number) => {
    setUserBookmarks((prev) =>
      prev.includes(timeStamp)
        ? prev.filter((t) => t !== timeStamp)
        : [...prev, timeStamp],
    );
  };

  const currentQuizData = lessonData.quizzes.find((q) => q.id === currentQuiz);

  // Start AI Post-Lesson Quiz: call backend and route to Quiz page
  const handleStartPostLessonQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch('/api/ai/post-lesson-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ lessonId, count: 5, difficulty: 'MEDIUM' }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Failed to create post-lesson quiz');
      }
      const data = await resp.json();
      // Normalize questions to the shape expected by Quiz.tsx
      const normalized = (data.questions || []).map((q: any, idx: number) => ({
        id: idx + 1,
        type: 'multiple-choice',
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
      }));
      // Store for Quiz page consumption
      localStorage.setItem('aiGeneratedQuiz', JSON.stringify({
        title: data?.quiz?.level === 'CHAPTER' ? 'Post-Lesson Quiz' : 'AI Quiz',
        subject: 'General',
        questions: normalized,
        meta: { quizId: data?.quiz?.id, level: data?.quiz?.level }
      }));
      navigate('/quiz');
    } catch (e) {
      console.error(e);
      alert('Could not start the post-lesson quiz. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Enhanced Header */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl">
              <Link to="/dashboard/learner">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="h-6 w-px bg-white/20"></div>
            <div>
              <h1 className="text-xl font-bold">{lessonData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>{lessonData.subject}</span>
                <span>•</span>
                <span>{lessonData.instructor}</span>
                <span>•</span>
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                  {lessonData.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Lesson Navigation */}
          <div className="flex items-center space-x-2">
            <Button 
              asChild
              variant="ghost" 
              size="sm"
              className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl"
            >
              <Link to={`/lesson/${parseInt(lessonId || '1') - 1}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
            
            <Button 
              asChild
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold"
              size="sm"
            >
              <Link to={`/lesson/${parseInt(lessonId || '1') + 1}`}>
                <ArrowRight className="h-4 w-4 mr-1" />
                Next Lesson
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="ghost" 
              size="sm"
              className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl"
            >
              <Link to="/courses">
                <BookOpen className="h-4 w-4 mr-1" />
                All Lessons
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 flex-1 flex items-center justify-center overflow-hidden">
            {/* Enhanced Video Content */}
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"></div>
              
              <div className="relative z-10 text-center p-8">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Play className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">
                  {lessonData.slides[currentSlide]?.title}
                </h3>
                <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                  {lessonData.slides[currentSlide]?.content}
                </p>
              </div>

              {/* Slide Image Overlay */}
              <div className="absolute top-6 right-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <img
                    src={lessonData.slides[currentSlide]?.imageUrl}
                    alt={`Slide content for ${lessonData.slides[currentSlide]?.title}`}
                    className="relative w-64 h-40 object-cover rounded-2xl border-2 border-white/20 shadow-xl"
                    style={{ width: "256px", height: "160px" }}
                  />
                </div>
              </div>

              {/* Enhanced Progress Overlay */}
              <div className="absolute top-6 left-6">
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-semibold">Progress</span>
                  </div>
                  <div className="w-40 bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${lessonProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-300 mt-2 flex items-center justify-between">
                    <span>{Math.round(lessonProgress)}% complete</span>
                    <span className="text-emerald-400 font-semibold">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quiz Overlay */}
            {quizMode && currentQuizData && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <Card className="max-w-3xl w-full mx-4 bg-white/95 backdrop-blur-md border-0 shadow-2xl">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Quick Knowledge Check
                    </h2>
                    <p className="text-gray-600">Test your understanding before continuing</p>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      {currentQuizData.question}
                    </h3>
                    <div className="space-y-3">
                      {currentQuizData.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(currentQuizData.id, index)}
                          className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center font-bold text-gray-700 group-hover:text-blue-700">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-gray-900 font-medium">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {userAnswers[currentQuizData.id] !== undefined && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                          <span className="font-bold text-green-700 text-lg">
                            {userAnswers[currentQuizData.id] === currentQuizData.correctAnswer
                              ? "Excellent! That's correct!"
                              : "Not quite right, but great effort!"}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {currentQuizData.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Enhanced Video Controls */}
          <div className="bg-black/90 backdrop-blur-md border-t border-white/10 p-6">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl p-3"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl p-3"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl p-3"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="flex-1 flex items-center space-x-4">
                <span className="text-sm text-gray-300 font-medium min-w-[3rem]">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <span className="text-sm text-gray-300 font-medium min-w-[3rem]">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl p-3"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>

                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-gray-700 text-white text-sm rounded-xl px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:text-gray-300 hover:bg-white/10 rounded-xl p-3"
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="w-96 bg-gray-800/90 backdrop-blur-md border-l border-gray-700 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setShowNotes(true)}
              className={`flex-1 p-4 text-sm font-semibold transition-all duration-300 ${
                showNotes 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <FileText className="h-4 w-4 mx-auto mb-1" />
              Notes
            </button>
            <button
              onClick={() => setShowNotes(false)}
              className={`flex-1 p-4 text-sm font-semibold transition-all duration-300 ${
                !showNotes 
                  ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <Download className="h-4 w-4 mx-auto mb-1" />
              Resources
            </button>
          </div>

          {showNotes ? (
            <div className="p-6 space-y-8">
              {/* Learning Objectives */}
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                  <Target className="h-5 w-5 mr-3 text-emerald-400" />
                  Learning Objectives
                </h3>
                <ul className="space-y-3">
                  {lessonData.learningObjectives.map((objective, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-sm text-gray-300 p-3 bg-gray-700/30 rounded-xl"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Points for Current Slide */}
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-3 text-yellow-400" />
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {lessonData.slides[currentSlide]?.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-300 flex items-center space-x-3 p-2 bg-gray-700/20 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Personal Notes */}
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-3 text-blue-400" />
                  My Notes
                </h3>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="w-full h-32 p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-sm focus:border-blue-500 focus:outline-none resize-none"
                />
                <Button
                  size="sm"
                  className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold"
                  onClick={() => toggleBookmark(currentTime)}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark Current Time
                </Button>
              </div>

              {/* AI Insights */}
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                  <Brain className="h-5 w-5 mr-3 text-purple-400" />
                  AI Study Tips
                </h3>
                <div className="space-y-3">
                  {lessonData.aiInsights.studyTips.map((tip, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl border border-purple-700/30"
                    >
                      <p className="text-sm text-purple-200">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transcript Toggle */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="w-full text-white border-gray-600 hover:bg-gray-700 rounded-xl"
                >
                  {showTranscript ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  {showTranscript ? "Hide" : "Show"} Transcript
                </Button>

                {showTranscript && (
                  <div className="mt-4 max-h-48 overflow-y-auto space-y-3 bg-gray-700/20 rounded-xl p-4">
                    {lessonData.transcript.map((entry, index) => (
                      <div key={index} className="text-xs">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-400 font-mono">
                            [{formatTime(entry.time)}]
                          </span>
                          <span className="text-blue-300 font-semibold">
                            {entry.speaker}:
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-500/30">
                          {entry.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {/* Related Lessons */}
              <div>
                <h3 className="font-bold text-white mb-4 text-lg">Related Lessons</h3>
                <div className="space-y-3">
                  {lessonData.relatedLessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-600/30 cursor-pointer transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm text-white font-medium">{lesson}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloads */}
              <div>
                <h3 className="font-bold text-white mb-4 text-lg">Downloads</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-white border-gray-600 hover:bg-gray-700 rounded-xl p-4 h-auto"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/api/lessons/' + lessonId + '/slides.pdf';
                      link.download = 'lesson-slides.pdf';
                      link.click();
                    }}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Lesson Slides</div>
                      <div className="text-xs text-gray-400">PDF Format</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-white border-gray-600 hover:bg-gray-700 rounded-xl p-4 h-auto"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/api/lessons/' + lessonId + '/study-guide.pdf';
                      link.download = 'study-guide.pdf';
                      link.click();
                    }}
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Study Guide</div>
                      <div className="text-xs text-gray-400">Comprehensive notes</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-white border-gray-600 hover:bg-gray-700 rounded-xl p-4 h-auto"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/api/lessons/' + lessonId + '/practice-questions.pdf';
                      link.download = 'practice-questions.pdf';
                      link.click();
                    }}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Practice Questions</div>
                      <div className="text-xs text-gray-400">Test yourself</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Next Lesson */}
              <div>
                <h3 className="font-bold text-white mb-4 text-lg">Up Next</h3>
                <div className="p-6 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/30 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-300 text-lg">
                        {lessonData.nextLesson}
                      </h4>
                      <p className="text-sm text-emerald-200/80">
                        Continue your learning journey
                      </p>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold"
                  >
                    <Link to={`/lesson/${parseInt(lessonId || '1') + 1}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Next Lesson
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full mx-4 bg-white border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Award className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Lesson Completed! 🎉
              </h2>
              <p className="text-gray-600 text-lg">
                Excellent work! You've successfully mastered this lesson.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Progress Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
                <h3 className="font-bold text-gray-900 mb-6 text-xl">Your Achievement</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-black text-emerald-600 mb-2">
                      {Math.round(lessonProgress)}%
                    </div>
                    <div className="text-gray-700 font-semibold">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-emerald-600 mb-2">
                      {Object.keys(userAnswers).length}/{lessonData.quizzes.length}
                    </div>
                    <div className="text-gray-700 font-semibold">Quizzes Answered</div>
                  </div>
                </div>
              </div>

              {/* Quiz Results */}
              {Object.keys(userAnswers).length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-xl">Quiz Performance</h3>
                  <div className="space-y-3">
                    {lessonData.quizzes.map((quiz) => {
                      const userAnswer = userAnswers[quiz.id];
                      const isCorrect = userAnswer === quiz.correctAnswer;
                      return (
                        <div
                          key={quiz.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <span className="text-gray-900 font-medium">Question {quiz.id}</span>
                          <div className="flex items-center space-x-3">
                            {isCorrect ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                <span className="text-emerald-600 font-bold">Correct</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                <span className="text-orange-600 font-bold">Review Needed</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Rate This Lesson</h3>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setUserRating(rating)}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        rating <= userRating
                          ? "text-yellow-500 scale-110"
                          : "text-gray-300 hover:text-yellow-400 hover:scale-105"
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="text-center text-gray-600">
                    Thank you for rating this lesson {userRating}/5 stars!
                  </p>
                )}
              </div>

              {/* Next Steps */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-bold text-gray-900 mb-6 text-xl">What's Next?</h3>
                <div className="grid gap-4">
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white justify-start p-6 h-auto rounded-xl font-semibold text-lg"
                  >
                    <Link to={`/lesson/${parseInt(lessonId || '1') + 1}`}>
                      <BookOpen className="h-6 w-6 mr-3" />
                      Continue to: {lessonData.nextLesson}
                    </Link>
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      asChild
                      variant="outline" 
                      className="justify-start p-4 h-auto rounded-xl border-2"
                    >
                      <Link to="/quiz">
                        <Target className="h-5 w-5 mr-2" />
                        Practice Quiz
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      variant="outline" 
                      className="justify-start p-4 h-auto rounded-xl border-2"
                    >
                      <Link to="/dashboard/learner">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        View Progress
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompletionModal(false);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  className="flex-1 border-2 rounded-xl py-3 font-semibold"
                >
                  Review Lesson
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl py-3 font-semibold"
                >
                  <Link to="/dashboard/learner">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
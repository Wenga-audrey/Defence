import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Share2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Star,
  Award,
  Calendar,
  BookOpen,
  RefreshCw,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Counter Animation Hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export default function QuizResults() {
  const [showDetails, setShowDetails] = useState(false);

  // Get actual quiz results from localStorage or use mock data
  const getQuizResults = () => {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      const data = JSON.parse(storedResults);
      
      // Use the pre-calculated data from Quiz component
      return {
        quizTitle: data.quizTitle,
        subject: data.subject,
        dateTaken: new Date(data.completedAt).toLocaleDateString(),
        timeSpent: `${Math.floor(data.timeSpent / 60)}m ${data.timeSpent % 60}s`,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        wrongAnswers: data.totalQuestions - data.correctAnswers,
        skippedAnswers: 0,
        score: data.score,
        grade: data.score >= 90 ? "A" : data.score >= 80 ? "B" : data.score >= 70 ? "C" : data.score >= 60 ? "D" : "F",
        passingScore: 70,
        timeAllowed: "30 minutes",
        accuracy: data.score,
        averageTime: `${Math.floor(data.timeSpent / data.totalQuestions / 60)}m ${Math.floor((data.timeSpent / data.totalQuestions) % 60)}s`,
        difficulty: "Intermediate",
        questions: data.questions,
        userAnswers: data.answers,
        questionAnalysis: data.questionAnalysis,
        passed: data.passed
      };
    }
    
    // Fallback to mock data
    return {
      quizTitle: "ENSP Mathematics Practice Test",
      subject: "Advanced Mathematics",
      dateTaken: "December 10, 2024",
      timeSpent: "45m 23s",
      totalQuestions: 25,
      correctAnswers: 21,
      wrongAnswers: 3,
      skippedAnswers: 1,
      score: 84,
      grade: "B+",
      passingScore: 70,
      timeAllowed: "60 minutes",
      accuracy: 84,
      averageTime: "1m 48s",
      difficulty: "Intermediate",
    };
  };

  const results = getQuizResults();

  const performance = {
    totalScore: useCounter(results.score),
    correctAnswers: useCounter(results.correctAnswers),
    accuracy: useCounter(results.accuracy),
    timeSpent: results.timeSpent,
  };

  // Mock question breakdown
  const questionBreakdown = [
    {
      id: 1,
      question: "What is the derivative of f(x) = 3x² + 2x + 1?",
      yourAnswer: "6x + 2",
      correctAnswer: "6x + 2",
      isCorrect: true,
      timeSpent: "2m 15s",
      category: "Calculus",
    },
    {
      id: 2,
      question: "Solve for x: 2x + 5 = 13",
      yourAnswer: "x = 4",
      correctAnswer: "x = 4",
      isCorrect: true,
      timeSpent: "1m 30s",
      category: "Algebra",
    },
    {
      id: 3,
      question: "What is the integral of 2x?",
      yourAnswer: "2x² + C",
      correctAnswer: "x² + C",
      isCorrect: false,
      timeSpent: "3m 45s",
      category: "Calculus",
    },
    {
      id: 4,
      question: "Which of the following is a prime number?",
      yourAnswer: "17",
      correctAnswer: "17",
      isCorrect: true,
      timeSpent: "1m 12s",
      category: "Number Theory",
    },
    {
      id: 5,
      question: "What is the value of sin(90°)?",
      yourAnswer: "Not answered",
      correctAnswer: "1",
      isCorrect: false,
      timeSpent: "0m 00s",
      category: "Trigonometry",
    },
  ];

  const categoryPerformance = [
    { category: "Calculus", correct: 3, total: 5, percentage: 60 },
    { category: "Algebra", correct: 8, total: 8, percentage: 100 },
    { category: "Number Theory", correct: 4, total: 5, percentage: 80 },
    { category: "Trigonometry", correct: 6, total: 7, percentage: 86 },
  ];

  const recommendations = [
    {
      icon: BookOpen,
      title: "Review Calculus Integration",
      description: "Focus on integration techniques and formulas",
      action: "Study Integration Module",
    },
    {
      icon: Target,
      title: "Practice Time Management",
      description: "Work on answering questions more efficiently",
      action: "Take Timed Practice Tests",
    },
    {
      icon: Star,
      title: "Strengthen Trigonometry",
      description: "Review basic trigonometric functions and identities",
      action: "Complete Trigonometry Exercises",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-mindboost-green";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-mindboost-green/10 text-mindboost-green";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Results Header */}
      <div className="bg-gradient-to-br from-mindboost-green to-mindboost-dark-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-4">Quiz Completed!</h1>
            <p className="text-xl text-white/90 mb-8">{results.quizTitle}</p>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-5xl font-black mb-2">
                  {performance.totalScore}%
                </div>
                <div className="text-white/80">Final Score</div>
              </div>
              <div className="w-px h-16 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-black mb-2">{results.grade}</div>
                <div className="text-white/80">Grade</div>
              </div>
              <div className="w-px h-16 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-black mb-2">
                  {performance.correctAnswers}/{results.totalQuestions}
                </div>
                <div className="text-white/80">Correct</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="bg-mindboost-green hover:bg-mindboost-green/90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button
            variant="outline"
            className="border-mindboost-green text-mindboost-green"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button
            variant="outline"
            className="border-mindboost-green text-mindboost-green"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <ArrowRight className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Performance Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Breakdown */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Performance Overview
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                    <div className="text-3xl font-black text-green-600 mb-1">
                      {performance.correctAnswers}
                    </div>
                    <div className="text-sm text-green-700 font-semibold">
                      Correct
                    </div>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-xl">
                    <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-black text-red-600 mb-1">
                      {results.wrongAnswers}
                    </div>
                    <div className="text-sm text-red-700 font-semibold">
                      Wrong
                    </div>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-xl">
                    <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                    <div className="text-3xl font-black text-yellow-600 mb-1">
                      {results.skippedAnswers}
                    </div>
                    <div className="text-sm text-yellow-700 font-semibold">
                      Skipped
                    </div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <Clock className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <div className="text-2xl font-black text-blue-600 mb-1">
                      {results.timeSpent}
                    </div>
                    <div className="text-sm text-blue-700 font-semibold">
                      Time Spent
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-6">
                  Performance by Category
                </h3>
                <div className="space-y-6">
                  {categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-black">
                          {category.category}
                        </span>
                        <span className="text-black/70">
                          {category.correct}/{category.total} (
                          {category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            category.percentage >= 80
                              ? "bg-green-500"
                              : category.percentage >= 70
                                ? "bg-mindboost-green"
                                : category.percentage >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Details */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-black">
                    Question Analysis
                  </h3>
                  <Button
                    onClick={() => setShowDetails(!showDetails)}
                    variant="outline"
                    className="border-mindboost-green text-mindboost-green"
                  >
                    {showDetails ? "Hide Details" : "Show Details"}
                  </Button>
                </div>

                {showDetails && (
                  <div className="space-y-4">
                    {(results.questionAnalysis || results.questions).map((question, index) => {
                      // Use questionAnalysis if available, otherwise fallback to questions
                      const analysisData = results.questionAnalysis ? question : {
                        question: question.question,
                        userAnswer: results.userAnswers[question.id] || "Not answered",
                        correctAnswer: question.correctAnswer,
                        isCorrect: (results.userAnswers[question.id] || "") === question.correctAnswer,
                        explanation: question.explanation
                      };
                      
                      const userAnswer = analysisData.userAnswer;
                      const isCorrect = analysisData.isCorrect;
                      
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge variant="outline">Q{index + 1}</Badge>
                                <Badge 
                                  variant="secondary"
                                  className={isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                  {isCorrect ? "Correct" : "Incorrect"}
                                </Badge>
                              </div>
                              <p className="font-semibold text-black mb-3">
                                {analysisData.question}
                              </p>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-black/70">
                                    Your Answer:{" "}
                                  </span>
                                  <span
                                    className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {userAnswer}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-black/70">
                                    Correct Answer:{" "}
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    {analysisData.correctAnswer}
                                  </span>
                                </div>
                              </div>
                              {analysisData.explanation && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    <strong>Explanation:</strong> {analysisData.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Quiz Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/70">Subject:</span>
                    <span className="font-semibold text-black">
                      {results.subject}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/70">Date:</span>
                    <span className="font-semibold text-black">
                      {results.dateTaken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/70">Duration:</span>
                    <span className="font-semibold text-black">
                      {results.timeSpent}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/70">Passing Score:</span>
                    <span className="font-semibold text-black">
                      {results.passingScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/70">Difficulty:</span>
                    <Badge variant="outline">{results.difficulty}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Badge */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-black mb-2">Performance Level</h3>
                <Badge
                  className={`${getGradeColor(results.score)} text-lg px-4 py-2`}
                >
                  {results.grade}
                </Badge>
                <p className="text-sm text-black/70 mt-3">
                  {results.score >= results.passingScore
                    ? "Congratulations! You passed!"
                    : "Keep studying and try again!"}
                </p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Recommendations</h3>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-4 bg-mindboost-green/5 rounded-xl"
                    >
                      <div className="flex items-start space-x-3">
                        <rec.icon className="h-5 w-5 text-mindboost-green mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-black text-sm mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-black/70 mb-2">
                            {rec.description}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-mindboost-green text-mindboost-green text-xs"
                          >
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white"
                  >
                    <Link to="/quiz">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retake Quiz
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-mindboost-green text-mindboost-green"
                  >
                    <Link to="/dashboard">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Study More
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/study-calendar">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Review
                    </Link>
                  </Button>
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

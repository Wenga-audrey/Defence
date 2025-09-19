import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  Timer,
  Flag,
  Eye,
  EyeOff,
  Play,
  Pause,
} from "@/lib/icons";
import { Link } from "react-router-dom";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set(),
  );

  // Mock quiz data
  const quiz = {
    title: "ENSP Mathematics Practice Test",
    subject: "Advanced Mathematics",
    duration: 60,
    totalQuestions: 25,
    instructions: [
      "Read each question carefully before answering",
      "You can navigate between questions using the navigation buttons",
      "Flag questions you want to review later",
      "Make sure to save your answers before submitting",
    ],
  };

  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isRetake, setIsRetake] = useState(false);

  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Check if this is a retake by looking for previous results
        const previousResults = localStorage.getItem('quizResults');
        const isRetake = previousResults !== null;
        
        if (isRetake) {
          // Clear previous results to force new AI generation
          localStorage.removeItem('quizResults');
          
          // Try to get AI-generated adaptive questions with timestamp to ensure uniqueness
          const response = await fetch('/api/assessments/adaptive/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              subject: quiz.subject,
              difficulty: 'intermediate',
              questionCount: 10,
              timestamp: Date.now(), // Add timestamp to ensure different questions
              retakeId: Math.random().toString(36).substr(2, 9) // Unique retake ID
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
              const adaptiveQuestions = data.questions.map((q: any, index: number) => ({
                id: index + 1,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation
              }));
              setQuestions(adaptiveQuestions);
              console.log('Loaded AI-generated questions for retake:', adaptiveQuestions.length);
              return;
            }
          }
        }
        
        // Fallback to default questions (shuffled for variety)
        const defaultQuestions = [
          {
            id: 1,
            type: "multiple-choice",
            question: "What is the derivative of f(x) = 3x² + 2x + 1?",
            options: ["6x + 2", "3x + 2", "6x + 1", "3x² + 2"],
            correctAnswer: "6x + 2",
            explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(1) = 0",
          },
          {
            id: 2,
            type: "multiple-choice",
            question: "Solve for x: 2x + 5 = 13",
            options: ["x = 4", "x = 6", "x = 8", "x = 9"],
            correctAnswer: "x = 4",
            explanation: "2x = 13 - 5 = 8, therefore x = 4",
          },
          {
            id: 3,
            type: "multiple-choice",
            question: "What is the integral of 2x?",
            options: ["x² + C", "2x² + C", "x²/2 + C", "2"],
            correctAnswer: "x² + C",
            explanation: "∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C",
          },
          {
            id: 4,
            type: "multiple-choice",
            question: "Which of the following is a prime number?",
            options: ["15", "21", "17", "25"],
            correctAnswer: "17",
            explanation: "17 is only divisible by 1 and itself, making it a prime number",
          },
          {
            id: 5,
            type: "multiple-choice",
            question: "What is the value of sin(π/2)?",
            options: ["0", "1", "-1", "π/2"],
            correctAnswer: "1",
            explanation: "sin(π/2) = sin(90°) = 1",
          },
          {
            id: 6,
            type: "multiple-choice",
            question: "If log₂(x) = 3, what is x?",
            options: ["6", "8", "9", "12"],
            correctAnswer: "8",
            explanation: "log₂(x) = 3 means 2³ = x, so x = 8",
          },
          {
            id: 7,
            type: "multiple-choice",
            question: "What is the slope of the line y = 3x - 2?",
            options: ["3", "-2", "1", "5"],
            correctAnswer: "3",
            explanation: "In the form y = mx + b, m is the slope, so the slope is 3",
          },
          {
            id: 8,
            type: "multiple-choice",
            question: "Simplify: (x²)³",
            options: ["x⁵", "x⁶", "x⁸", "3x²"],
            correctAnswer: "x⁶",
            explanation: "Using the power rule: (x²)³ = x^(2×3) = x⁶",
          },
          {
            id: 9,
            type: "multiple-choice",
            question: "What is 25% of 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: "20",
            explanation: "25% = 0.25, so 0.25 × 80 = 20",
          },
          {
            id: 10,
            type: "multiple-choice",
            question: "Solve the quadratic equation: x² - 5x + 6 = 0",
            options: ["x = 2, x = 3", "x = 1, x = 6", "x = -2, x = -3", "x = 0, x = 5"],
            correctAnswer: "x = 2, x = 3",
            explanation: "Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3",
          },
        ];
        const shuffledQuestions = [...defaultQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        console.log('Loaded default questions:', shuffledQuestions.length);
      } catch (error) {
        console.error('Error loading questions:', error);
        const defaultQuestions = [
          {
            id: 1,
            type: "multiple-choice",
            question: "What is the derivative of f(x) = 3x² + 2x + 1?",
            options: ["6x + 2", "3x + 2", "6x + 1", "3x² + 2"],
            correctAnswer: "6x + 2",
            explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(1) = 0",
          },
          {
            id: 2,
            type: "multiple-choice",
            question: "Solve for x: 2x + 5 = 13",
            options: ["x = 4", "x = 6", "x = 8", "x = 9"],
            correctAnswer: "x = 4",
            explanation: "2x = 13 - 5 = 8, therefore x = 4",
          },
          {
            id: 3,
            type: "multiple-choice",
            question: "What is the integral of 2x?",
            options: ["x² + C", "2x² + C", "x²/2 + C", "2"],
            correctAnswer: "x² + C",
            explanation: "∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C",
          },
          {
            id: 4,
            type: "multiple-choice",
            question: "Which of the following is a prime number?",
            options: ["15", "21", "17", "25"],
            correctAnswer: "17",
            explanation: "17 is only divisible by 1 and itself, making it a prime number",
          },
          {
            id: 5,
            type: "multiple-choice",
            question: "What is the value of sin(π/2)?",
            options: ["0", "1", "-1", "π/2"],
            correctAnswer: "1",
            explanation: "sin(π/2) = sin(90°) = 1",
          },
          {
            id: 6,
            type: "multiple-choice",
            question: "If log₂(x) = 3, what is x?",
            options: ["6", "8", "9", "12"],
            correctAnswer: "8",
            explanation: "log₂(x) = 3 means 2³ = x, so x = 8",
          },
          {
            id: 7,
            type: "multiple-choice",
            question: "What is the slope of the line y = 3x - 2?",
            options: ["3", "-2", "1", "5"],
            correctAnswer: "3",
            explanation: "In the form y = mx + b, m is the slope, so the slope is 3",
          },
          {
            id: 8,
            type: "multiple-choice",
            question: "Simplify: (x²)³",
            options: ["x⁵", "x⁶", "x⁸", "3x²"],
            correctAnswer: "x⁶",
            explanation: "Using the power rule: (x²)³ = x^(2×3) = x⁶",
          },
          {
            id: 9,
            type: "multiple-choice",
            question: "What is 25% of 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: "20",
            explanation: "25% = 0.25, so 0.25 × 80 = 20",
          },
          {
            id: 10,
            type: "multiple-choice",
            question: "Solve the quadratic equation: x² - 5x + 6 = 0",
            options: ["x = 2, x = 3", "x = 1, x = 6", "x = -2, x = -3", "x = 0, x = 5"],
            correctAnswer: "x = 2, x = 3",
            explanation: "Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3",
          },
        ];
        setQuestions(defaultQuestions);
      }
    };
    
    loadQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Auto-submit when time runs out
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    setIsRunning(false);
    
    // Calculate score
    let correctAnswers = 0;
    const questionAnalysis = questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        id: question.id,
        question: question.question,
        userAnswer: userAnswer || "Not answered",
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        options: question.options
      };
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Store quiz results in localStorage for the results page
    const quizResults = {
      quizTitle: quiz.title,
      subject: quiz.subject,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      answers,
      questions,
      questionAnalysis,
      timeSpent: 1800 - timeRemaining,
      completedAt: new Date().toISOString(),
      passed: score >= 70
    };
    
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    
    console.log("Quiz results stored:", quizResults);
    alert(`Quiz completed! Score: ${score}% (${correctAnswers}/${questions.length} correct)`);
    
    // Navigate to results page
    window.location.href = "/quiz-results";
  };

  const getQuestionStatus = (index: number) => {
    const questionId = questions[index].id;
    if (answers[questionId]) {
      return "answered";
    } else if (flaggedQuestions.has(questionId)) {
      return "flagged";
    } else {
      return "unanswered";
    }
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flaggedQuestions.size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz Header */}
      <div className="bg-gradient-to-br from-mindboost-green to-mindboost-dark-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">{quiz.title}</h1>
              <p className="text-white/90">{quiz.subject}</p>
              {isRetake && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-200">AI-Generated Adaptive Questions</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, "0")}
              </div>
              <p className="text-white/90 text-sm">Time Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {isLoadingQuestions ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mindboost-green mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            {isRetake ? "Generating AI-powered adaptive questions..." : "Loading quiz questions..."}
          </p>
        </div>
      ) : questions.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-lg text-gray-600">No questions available</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-6">
                  <h3 className="font-bold text-black mb-4">Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/70">Answered</span>
                      <span className="font-semibold text-black">
                        {answeredCount}/{questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-mindboost-green h-2 rounded-full transition-all"
                        style={{
                          width: `${(answeredCount / questions.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black/70">Flagged</span>
                      <span className="font-semibold text-black">
                        {flaggedCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-black mb-3">Questions</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, index) => {
                      const status = getQuestionStatus(index);
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionSelect(index)}
                          className={`w-10 h-10 rounded-lg border-2 text-sm font-bold transition-all ${
                            currentQuestion === index
                              ? "bg-mindboost-green text-white border-mindboost-green"
                              : status === "answered"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : status === "flagged"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                  : "bg-gray-100 text-black/70 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-black/70">Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span className="text-black/70">Flagged</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-black/70">Unanswered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-mindboost-green text-white">
                      Question {currentQuestion + 1} of {questions.length}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-mindboost-green text-mindboost-green"
                    >
                      Multiple Choice
                    </Badge>
                  </div>
                  <Button
                    onClick={() => toggleFlag(questions[currentQuestion].id)}
                    variant="outline"
                    size="sm"
                    className={`${
                      flaggedQuestions.has(questions[currentQuestion].id)
                        ? "bg-yellow-100 border-yellow-300 text-yellow-700"
                        : "border-mindboost-green text-mindboost-green"
                    }`}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {flaggedQuestions.has(questions[currentQuestion].id)
                      ? "Unflag"
                      : "Flag"}
                  </Button>
                </div>

                {/* Question Content */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-black mb-6 leading-relaxed">
                    {questions[currentQuestion].question}
                  </h2>

                  {/* Answer Options */}
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-mindboost-green/5 ${
                          answers[questions[currentQuestion].id] === option
                            ? "border-mindboost-green bg-mindboost-green/10"
                            : "border-gray-200 hover:border-mindboost-green/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questions[currentQuestion].id}`}
                          value={option}
                          checked={
                            answers[questions[currentQuestion].id] === option
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              questions[currentQuestion].id,
                              e.target.value,
                            )
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                            answers[questions[currentQuestion].id] === option
                              ? "border-mindboost-green bg-mindboost-green"
                              : "border-gray-300"
                          }`}
                        >
                          {answers[questions[currentQuestion].id] ===
                            option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-lg text-black">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Show Answer Toggle (for demo purposes) */}
                <div className="mb-8">
                  <Button
                    onClick={() => setShowAnswers(!showAnswers)}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-500"
                  >
                    {showAnswers ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {showAnswers ? "Hide" : "Show"} Answer
                  </Button>
                </div>

                {/* Answer Explanation (Demo) */}
                {showAnswers && (
                  <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                      <div>
                        <p className="font-bold text-black mb-2">
                          Correct Answer:{" "}
                          {questions[currentQuestion].correctAnswer}
                        </p>
                        <p className="text-black/70">
                          {questions[currentQuestion].explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="border-mindboost-green text-mindboost-green disabled:border-gray-300 disabled:text-gray-400"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="text-sm text-black/70">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>

                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Submit Quiz
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-mindboost-green hover:bg-mindboost-green/90 text-white"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quiz Instructions */}
            <Card className="border-0 shadow-lg mt-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-mindboost-green" />
                  Instructions
                </h3>
                <ul className="space-y-2">
                  {quiz.instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-black/70"
                    >
                      <Target className="h-4 w-4 mt-0.5 text-mindboost-green flex-shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal for Time */}
      {timeRemaining < 300 && timeRemaining > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-xl flex items-center space-x-3">
            <AlertCircle className="h-6 w-6" />
            <div>
              <p className="font-bold">Time Warning!</p>
              <p className="text-sm">Less than 5 minutes remaining</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

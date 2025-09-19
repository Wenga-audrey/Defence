import express from "express";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { googleAI } from "../lib/googleAI.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Generate AI study recommendations
router.post('/recommendations', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { availableTime = 60 } = req.body;

    // Get user profile and recent performance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assessmentResults: {
          orderBy: { id: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recentPerformance = user.assessmentResults.map(assessment => ({
      subject: 'General',
      score: assessment.score,
      date: assessment.completedAt.toISOString().split('T')[0]
    }));

    const aiResponse = await googleAI.generateStudyRecommendations(
      {
        level: user.role === 'LEARNER' ? 'Intermediate' : 'Advanced',
        subjects: ['Mathematics', 'Science', 'General Knowledge'],
        learningStyle: 'Visual'
      },
      recentPerformance,
      availableTime
    );

    if (!aiResponse.success) {
      return res.status(500).json({ 
        error: "Failed to generate recommendations",
        fallback: {
          priorityTopics: ["Review weak areas", "Practice problem solving", "Study fundamentals"],
          studyMethods: ["Active recall", "Spaced repetition", "Practice tests"],
          timeAllocation: { review: "30%", newContent: "50%", practice: "20%" },
          weeklyGoals: ["Complete 3 practice quizzes", "Review 2 challenging topics"],
          motivationalTip: "Consistent daily practice leads to mastery!"
        }
      });
    }

    try {
      const recommendations = JSON.parse(aiResponse.content!);
      res.json({ success: true, recommendations });
    } catch (parseError) {
      res.json({ 
        success: true, 
        recommendations: {
          priorityTopics: ["Review fundamentals", "Practice regularly"],
          studyMethods: ["Active learning", "Regular testing"],
          motivationalTip: aiResponse.content
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

// Generate AI explanation for incorrect answers
router.post('/explain-answer', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { question, userAnswer, correctAnswer, subject } = req.body;

    if (!question || !userAnswer || !correctAnswer || !subject) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const aiResponse = await googleAI.generateAnswerExplanation(
      question,
      userAnswer,
      correctAnswer,
      subject
    );

    if (!aiResponse.success) {
      return res.json({
        success: true,
        explanation: `The correct answer is "${correctAnswer}". Your answer "${userAnswer}" was incorrect. Please review the concept and try again.`
      });
    }

    res.json({
      success: true,
      explanation: aiResponse.content
    });
  } catch (error) {
    next(error);
  }
});

// AI Chatbot endpoint
router.post('/chat', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get user context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assessmentResults: {
          orderBy: { id: 'desc' },
          take: 1
        }
      }
    });

    const context = {
      currentCourse: "Mathematics",
      recentScore: user?.assessmentResults[0]?.score || null,
      studyStreak: 5 // This would come from actual tracking
    };

    const aiResponse = await googleAI.generateChatbotResponse(
      message,
      context,
      conversationHistory
    );

    if (!aiResponse.success) {
      return res.json({
        success: true,
        response: "I'm here to help with your studies! Feel free to ask me any questions about your courses or learning progress."
      });
    }

    res.json({
      success: true,
      response: aiResponse.content
    });
  } catch (error) {
    next(error);
  }
});

// Generate personalized lesson content
router.post('/generate-lesson', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { topic, difficulty = 'intermediate', learningStyle = 'visual', duration = 30 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const aiResponse = await googleAI.generateLessonContent(
      topic,
      difficulty,
      learningStyle,
      duration
    );

    if (!aiResponse.success) {
      return res.json({
        success: true,
        content: `# ${topic}\n\nThis lesson covers the fundamentals of ${topic}. Please refer to your course materials for detailed content.`
      });
    }

    res.json({
      success: true,
      content: aiResponse.content
    });
  } catch (error) {
    next(error);
  }
});

// Generate performance insights
router.get('/performance-insights', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { timeframe = 'week' } = req.query;

    // Get user performance data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assessmentResults: {
          orderBy: { id: 'desc' },
          take: 10
        }
      }
    });

    if (!user || !user.assessmentResults.length) {
      return res.json({
        success: true,
        insights: {
          overallAssessment: "Not enough data yet. Keep taking quizzes to get personalized insights!",
          strengths: ["Getting started with learning"],
          areasForImprovement: ["Take more assessments"],
          recommendations: ["Complete your first few quizzes", "Establish a regular study routine"],
          nextSteps: ["Take a practice quiz", "Set study goals"],
          motivationalMessage: "Every expert was once a beginner. You're on the right track!",
          predictedOutcome: "With consistent practice, you'll see great improvement"
        }
      });
    }

    const averageScore = user.assessmentResults.reduce((sum, a) => sum + a.score, 0) / user.assessmentResults.length;
    const studentData = {
      averageScore: Math.round(averageScore),
      completedLessons: user.assessmentResults.length,
      studyTime: user.assessmentResults.length * 0.5, // Estimate
      strongSubjects: user.assessmentResults.filter(a => a.score >= 80).map(a => 'General'),
      weakSubjects: user.assessmentResults.filter(a => a.score < 60).map(a => 'General'),
      quizAttempts: user.assessmentResults.length,
      trend: user.assessmentResults.length > 1 ? 
        (user.assessmentResults[0].score > user.assessmentResults[1].score ? 'Improving' : 'Stable') : 'Stable'
    };

    const aiResponse = await googleAI.generatePerformanceInsights(studentData, timeframe as string);

    if (!aiResponse.success) {
      return res.json({
        success: true,
        insights: {
          overallAssessment: `Your average score is ${studentData.averageScore}%. Keep up the good work!`,
          strengths: studentData.strongSubjects,
          areasForImprovement: studentData.weakSubjects,
          recommendations: ["Practice regularly", "Focus on weak areas"],
          nextSteps: ["Take more quizzes", "Review challenging topics"],
          motivationalMessage: "You're making progress! Keep learning consistently.",
          predictedOutcome: "Continued improvement expected with regular practice"
        }
      });
    }

    try {
      const insights = JSON.parse(aiResponse.content!);
      res.json({ success: true, insights });
    } catch (parseError) {
      res.json({
        success: true,
        insights: {
          overallAssessment: aiResponse.content,
          recommendations: ["Keep practicing", "Stay consistent"],
          motivationalMessage: "You're doing great! Keep up the momentum."
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

// Generate study reminders
router.post('/study-reminder', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assessmentResults: { take: 1, orderBy: { id: 'desc' } }
      }
    });

    const userProgress = {
      completedCourses: user?.assessmentResults.length || 0,
      recentActivity: 'moderate'
    };

    const aiResponse = await googleAI.generateStudyReminder(userProgress, 3);

    if (!aiResponse.success) {
      return res.json({
        success: true,
        reminder: "Time to study! Consistent daily practice is the key to success. You've got this!"
      });
    }

    res.json({
      success: true,
      reminder: aiResponse.content
    });
  } catch (error) {
    next(error);
  }
});

export default router;

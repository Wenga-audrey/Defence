import express from "express";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { googleAI } from "../lib/googleAI.js";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

// Zod schemas for request validation
const RecommendationsSchema = z.object({
  availableTime: z.number().int().min(5).max(600).default(60),
});

const GenerateQuizSchema = z.object({
  chapterId: z.string().optional(),
  subjectId: z.string().optional(),
  count: z.coerce.number().int().min(1).max(100).default(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  examType: z.string().optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
}).refine((d) => !!d.chapterId || !!d.subjectId, {
  message: "Provide either chapterId or subjectId",
});

const PostLessonQuizSchema = z.object({
  lessonId: z.string(),
  count: z.coerce.number().int().min(1).max(50).default(5),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
});

const ExplainAnswerSchema = z.object({
  question: z.string().min(5),
  userAnswer: z.string().min(1),
  correctAnswer: z.string().min(1),
  subject: z.string().min(2),
});

const GenerateLessonSchema = z.object({
  topic: z.string().min(2),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  learningStyle: z.enum(["visual", "auditory", "kinesthetic", "reading"]).default("visual"),
  duration: z.coerce.number().int().min(10).max(240).default(30),
});

// Generate AI study recommendations
router.post('/recommendations', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { availableTime } = RecommendationsSchema.parse(req.body);

    // Get user profile and recent performance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        quizResults: {
          orderBy: { id: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recentPerformance = user.quizResults.map(assessment => ({
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

// Generate a quiz and persist it (chapter- or subject-level)
router.post('/generate-quiz', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { chapterId, subjectId, count, difficulty, examType, title, description } = GenerateQuizSchema.parse(req.body);

    if (!chapterId && !subjectId) {
      return res.status(400).json({ error: "Provide either chapterId or subjectId" });
    }

    // Resolve context from DB
    let contextExamType = examType as string | undefined;
    let resolvedChapter: any = null;
    let resolvedSubject: any = null;

    if (chapterId) {
      resolvedChapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
        include: { subject: { include: { class: true } } }
      });
      if (!resolvedChapter) return res.status(404).json({ error: "Chapter not found" });
      contextExamType = contextExamType || resolvedChapter.subject.class.examType;
    }

    if (!resolvedChapter && subjectId) {
      resolvedSubject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: { class: true }
      });
      if (!resolvedSubject) return res.status(404).json({ error: "Subject not found" });
      contextExamType = contextExamType || resolvedSubject.class.examType;
    }

    if (!contextExamType) {
      return res.status(400).json({ error: "Unable to resolve examType from context; pass examType explicitly" });
    }

    // Eligibility gate: learner must have gone through the relevant content
    // Subject-level: require at least 50% of subject chapters completed by this user
    // Chapter-level: require at least some recorded progress for this chapter
    if (resolvedSubject) {
      const subjectChapters = await prisma.chapter.findMany({
        where: { subjectId: resolvedSubject.id },
        select: { id: true },
      });
      const chapterIds = subjectChapters.map((c) => c.id);
      const progress = await prisma.chapterProgress.findMany({
        where: { userId, chapterId: { in: chapterIds } },
        select: { isCompleted: true },
      });
      const total = chapterIds.length || 0;
      const completed = progress.filter((p) => p.isCompleted).length;
      const pct = total > 0 ? (completed / total) * 100 : 0;
      if (total === 0) {
        return res.status(403).json({ error: "Subject has no chapters; quiz is not available." });
      }
      if (pct < 50) {
        return res.status(403).json({ error: "Please study at least 50% of this subject before taking the quiz." });
      }
    }

    if (resolvedChapter) {
      const cp = await prisma.chapterProgress.findUnique({
        where: { userId_chapterId: { userId, chapterId: resolvedChapter.id } },
        select: { isCompleted: true, timeSpent: true },
      });
      if (!cp) {
        return res.status(403).json({ error: "Please start this chapter before taking its quiz." });
      }
    }

    // Call AI to generate questions
    const ai = await googleAI.generateAdaptiveQuestions(contextExamType, String(difficulty), [], Number(count));
    if (!ai.success || !ai.content) {
      return res.status(500).json({ error: ai.error || "AI generation failed" });
    }

    // Parse AI output safely
    let items: any[] = [];
    try {
      const parsed = JSON.parse(ai.content);
      if (!Array.isArray(parsed)) throw new Error('AI did not return an array');
      items = parsed;
    } catch (e) {
      return res.status(422).json({ error: "AI returned invalid JSON. Please try again." });
    }

    // Create quiz container
    let quizId: string;
    let isChapterQuiz = false;
    if (resolvedChapter) {
      const q = await prisma.chapterQuiz.create({
        data: ({
          chapterId: resolvedChapter.id,
          title: title || `${resolvedChapter.title} - AI Quiz`,
          description: description || `Auto-generated quiz for ${resolvedChapter.title}`,
          timeLimit: Math.max(15, Math.min(180, Number(count) * 2)),
          passingScore: 60,
          isActive: true,
          createdById: userId,
          source: 'AI',
        } as any),
      });
      quizId = q.id;
      isChapterQuiz = true;
    } else {
      const q = await prisma.subjectQuiz.create({
        data: ({
          subjectId: resolvedSubject.id,
          title: title || `${resolvedSubject.name} - AI Quiz`,
          description: description || `Auto-generated quiz for ${resolvedSubject.name}`,
          timeLimit: Math.max(30, Math.min(180, Number(count) * 3)),
          passingScore: 60,
          isActive: true,
          createdById: userId,
          source: 'AI',
        } as any),
      });
      quizId = q.id;
    }

    // Persist questions
    const createdQuestions = await Promise.all(items.map((q, idx) =>
      prisma.quizQuestion.create({
        data: {
          chapterQuizId: isChapterQuiz ? quizId : null,
          subjectQuizId: isChapterQuiz ? null : quizId,
          question: String(q.question ?? q.stem ?? ''),
          type: 'multiple-choice',
          options: q.options ? q.options : q.choices ? q.choices : null,
          correctAnswer: String(q.correctAnswer ?? ''),
          explanation: q.explanation ? String(q.explanation) : null,
          difficulty: String(q.difficulty ?? difficulty),
          points: 1,
          order: idx + 1,
          isAIGenerated: true,
        }
      })
    ));

    // Notify enrolled learners in the related class
    try {
      if (isChapterQuiz) {
        await notifyClassLearnersForChapterQuiz(prisma, resolvedChapter.id, quizId, title || `${resolvedChapter.title} - AI Quiz`);
      } else if (resolvedSubject) {
        await notifyClassLearnersForSubjectQuiz(prisma, resolvedSubject.id, quizId, title || `${resolvedSubject.name} - AI Quiz`);
      }
    } catch (notifyErr) {
      console.error('Failed to send quiz notifications:', notifyErr);
    }

    return res.json({
      success: true,
      quiz: {
        id: quizId,
        level: isChapterQuiz ? 'CHAPTER' : 'SUBJECT',
        count: createdQuestions.length,
      },
      questions: createdQuestions.map(q => ({ id: q.id, question: q.question, options: q.options }))
    });
  } catch (error) {
    next(error);
  }
});

// Generate AI explanation for incorrect answers
router.post('/explain-answer', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { question, userAnswer, correctAnswer, subject } = ExplainAnswerSchema.parse(req.body);

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
        quizResults: {
          orderBy: { id: 'desc' },
          take: 1
        }
      }
    });

    const context = {
      currentCourse: "Mathematics",
      recentScore: user?.quizResults[0]?.score || null,
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
    const { topic, difficulty, learningStyle, duration } = GenerateLessonSchema.parse(req.body);

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

// Generate a short post-lesson quiz for a given lesson
router.post('/post-lesson-quiz', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { lessonId, count, difficulty, title, description } = PostLessonQuizSchema.parse(req.body);

    if (!lessonId) {
      return res.status(400).json({ error: 'lessonId is required' });
    }

    // Resolve lesson -> chapter -> subject -> class (for examType)
    const lesson = await prisma.lesson.findUnique({
      where: { id: String(lessonId) },
      include: {
        chapter: {
          include: {
            subject: { include: { class: true } }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const chapter = lesson.chapter;
    const examType = chapter.subject.class.examType;

    // Use existing AI generator to produce items
    const ai = await googleAI.generateAdaptiveQuestions(examType, String(difficulty), [], Number(count));
    if (!ai.success || !ai.content) {
      return res.status(500).json({ error: ai.error || 'AI generation failed' });
    }

    // Parse AI items safely
    let items: any[] = [];
    try {
      const parsed = JSON.parse(ai.content);
      if (!Array.isArray(parsed)) throw new Error('AI did not return an array');
      items = parsed;
    } catch {
      return res.status(422).json({ error: 'AI returned invalid JSON. Please try again.' });
    }

    // Create ChapterQuiz
    const quiz = await prisma.chapterQuiz.create({
      data: ({
        chapterId: chapter.id,
        title: title || `${lesson.title} - Post-lesson Quiz`,
        description: description || `Auto-generated quiz for lesson: ${lesson.title}`,
        timeLimit: Math.max(10, Math.min(90, Number(count) * 2)),
        passingScore: 60,
        isActive: true,
        createdById: req.user!.id,
        source: 'AI',
      } as any)
    });

    // Persist questions
    const createdQuestions = await Promise.all(items.map((q, idx) =>
      prisma.quizQuestion.create({
        data: {
          chapterQuizId: quiz.id,
          subjectQuizId: null,
          question: String(q.question ?? q.stem ?? ''),
          type: 'multiple-choice',
          options: q.options ? q.options : q.choices ? q.choices : null,
          correctAnswer: String(q.correctAnswer ?? ''),
          explanation: q.explanation ? String(q.explanation) : null,
          difficulty: String(q.difficulty ?? difficulty),
          points: 1,
          order: idx + 1,
          isAIGenerated: true,
        }
      })
    ));

    // Notify enrolled learners in the related class
    try {
      await notifyClassLearnersForChapterQuiz(prisma, chapter.id, quiz.id, title || `${lesson.title} - Post-lesson Quiz`);
    } catch (notifyErr) {
      console.error('Failed to send quiz notifications:', notifyErr);
    }

    return res.json({
      success: true,
      quiz: { id: quiz.id, level: 'CHAPTER', count: createdQuestions.length },
      questions: createdQuestions.map(q => ({ id: q.id, question: q.question, options: q.options }))
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
        quizResults: {
          orderBy: { id: 'desc' },
          take: 10
        }
      }
    });

    if (!user || !user.quizResults.length) {
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

    const averageScore = user.quizResults.reduce((sum, a) => sum + a.score, 0) / user.quizResults.length;
    const studentData = {
      averageScore: Math.round(averageScore),
      completedLessons: user.quizResults.length,
      studyTime: user.quizResults.length * 0.5, // Estimate
      strongSubjects: user.quizResults.filter(a => a.score >= 80).map(a => 'General'),
      weakSubjects: user.quizResults.filter(a => a.score < 60).map(a => 'General'),
      quizAttempts: user.quizResults.length,
      trend: user.quizResults.length > 1 ? 
        (user.quizResults[0].score > user.quizResults[1].score ? 'Improving' : 'Stable') : 'Stable'
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
        quizResults: { take: 1, orderBy: { id: 'desc' } }
      }
    });

    const userProgress = {
      completedCourses: user?.quizResults.length || 0,
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

// Helper functions
async function notifyClassLearnersForChapterQuiz(prisma: PrismaClient, chapterId: string, quizId: string, quizTitle: string) {
  // Find class via chapter -> subject -> class
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { subject: { include: { class: true } } }
  });
  if (!chapter) return;
  const classId = chapter.subject.class.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { classId },
    select: { userId: true }
  });
  if (!enrollments.length) return;

  const notifications = enrollments.map(e => ({
    userId: e.userId,
    title: 'New Chapter Quiz Available',
    message: `A new quiz "${quizTitle}" has been published for chapter ${chapter.title}.`,
    type: 'quiz'
  }));
  await (prisma as any).notification.createMany({ data: notifications });
}

async function notifyClassLearnersForSubjectQuiz(prisma: PrismaClient, subjectId: string, quizId: string, quizTitle: string) {
  // Find class via subject -> class
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: { class: true }
  });
  if (!subject) return;
  const classId = subject.class.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { classId },
    select: { userId: true }
  });
  if (!enrollments.length) return;

  const notifications = enrollments.map(e => ({
    userId: e.userId,
    title: 'New Subject Quiz Available',
    message: `A new quiz "${quizTitle}" has been published for subject ${subject.name}.`,
    type: 'quiz'
  }));
  await (prisma as any).notification.createMany({ data: notifications });
}

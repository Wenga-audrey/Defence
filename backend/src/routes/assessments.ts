import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  AuthRequest,
  requireInstructor,
} from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// Validation schemas
const createAssessmentSchema = z.object({
  body: z.object({
    lessonId: z.string().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(["QUIZ", "PRACTICE_TEST", "FINAL_EXAM", "ADAPTIVE"]),
    timeLimit: z.number().positive().optional(),
    passingScore: z.number().min(0).max(100).default(70),
  }),
});

const createQuestionSchema = z.object({
  body: z.object({
    assessmentId: z.string(),
    question: z.string().min(1),
    type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY"]),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1),
    explanation: z.string().optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
    points: z.number().positive().default(1),
    order: z.number().positive(),
  }),
});

const submitAssessmentSchema = z.object({
  body: z.object({
    answers: z.array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
        timeSpent: z.number().optional(),
      }),
    ),
  }),
});

// Get assessments for a lesson
router.get(
  "/lesson/:lessonId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { lessonId } = req.params;
      const userId = req.user!.id;

      // Check if lesson exists and user is enrolled
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true },
      });

      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.courseId,
          },
        },
      });

      if (!enrollment) {
        return res
          .status(403)
          .json({
            error: "You must be enrolled in the course to access assessments",
          });
      }

      const assessments = await prisma.assessment.findMany({
        where: {
          lessonId,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          timeLimit: true,
          passingScore: true,
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

      // Get user's results for these assessments
      const results = await prisma.assessmentResult.findMany({
        where: {
          userId,
          assessmentId: {
            in: assessments.map((a) => a.id),
          },
        },
        select: {
          assessmentId: true,
          score: true,
          completedAt: true,
        },
      });

      const assessmentsWithResults = assessments.map((assessment) => ({
        ...assessment,
        userResult: results.find((r) => r.assessmentId === assessment.id),
      }));

      res.json({ assessments: assessmentsWithResults });
    } catch (error) {
      next(error);
    }
  },
);

// Get single assessment with questions
router.get("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            type: true,
            options: true,
            difficulty: true,
            points: true,
            order: true,
            // Don't include correctAnswer or explanation
          },
        },
      },
    });

    if (!assessment || !assessment.isPublished) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    // Check enrollment if assessment is linked to a lesson
    if (assessment.lesson) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: assessment.lesson.courseId,
          },
        },
      });

      if (!enrollment) {
        return res
          .status(403)
          .json({
            error:
              "You must be enrolled in the course to access this assessment",
          });
      }
    }

    res.json({ assessment });
  } catch (error) {
    next(error);
  }
});

// Submit assessment
router.post(
  "/:id/submit",
  authenticate,
  validate(submitAssessmentSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      const userId = req.user!.id;

      // Get assessment with questions
      const assessment = await prisma.assessment.findUnique({
        where: { id },
        include: {
          questions: true,
          lesson: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!assessment || !assessment.isPublished) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      // Check enrollment if assessment is linked to a lesson
      if (assessment.lesson) {
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId: assessment.lesson.courseId,
            },
          },
        });

        if (!enrollment) {
          return res
            .status(403)
            .json({
              error:
                "You must be enrolled in the course to submit this assessment",
            });
        }
      }

      // Check if user has already submitted this assessment
      const existingResult = await prisma.assessmentResult.findFirst({
        where: {
          userId,
          assessmentId: id,
        },
      });

      if (existingResult && assessment.type === "FINAL_EXAM") {
        return res
          .status(409)
          .json({ error: "You have already submitted this final exam" });
      }

      // Calculate score
      let correctAnswers = 0;
      let totalPoints = 0;
      const answerRecords: any[] = [];

      for (const answer of answers) {
        const question = assessment.questions.find(
          (q) => q.id === answer.questionId,
        );
        if (!question) continue;

        const isCorrect =
          question.correctAnswer.toLowerCase().trim() ===
          answer.answer.toLowerCase().trim();
        if (isCorrect) correctAnswers += question.points;
        totalPoints += question.points;

        answerRecords.push({
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect,
          timeSpent: answer.timeSpent || 0,
        });
      }

      const score =
        totalPoints > 0 ? Math.round((correctAnswers / totalPoints) * 100) : 0;
      const totalTimeSpent = answerRecords.reduce(
        (sum, a) => sum + (a.timeSpent || 0),
        0,
      );

      // Create assessment result
      const result = await prisma.assessmentResult.create({
        data: {
          userId,
          assessmentId: id,
          score,
          totalPoints,
          timeSpent: totalTimeSpent,
          answers: {
            create: answerRecords,
          },
        },
        include: {
          answers: {
            include: {
              question: {
                select: {
                  question: true,
                  correctAnswer: true,
                  explanation: true,
                  points: true,
                },
              },
            },
          },
        },
      });

      // Check for achievements
      if (score >= assessment.passingScore) {
        // TODO: Award achievement for passing assessment
      }

      res.status(201).json({
        message: "Assessment submitted successfully",
        result: {
          id: result.id,
          score: result.score,
          totalPoints: result.totalPoints,
          timeSpent: result.timeSpent,
          passed: score >= assessment.passingScore,
          answers: result.answers,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get user's assessment results
router.get("/my/results", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = "1", limit = "20", assessmentId } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { userId };
    if (assessmentId) {
      where.assessmentId = assessmentId;
    }

    const [results, total] = await Promise.all([
      prisma.assessmentResult.findMany({
        where,
        skip,
        take,
        orderBy: { completedAt: "desc" },
        include: {
          assessment: {
            select: {
              id: true,
              title: true,
              type: true,
              passingScore: true,
              lesson: {
                select: {
                  title: true,
                  course: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.assessmentResult.count({ where }),
    ]);

    res.json({
      results,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create assessment (instructor/admin only)
router.post(
  "/",
  authenticate,
  requireInstructor,
  validate(createAssessmentSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { lessonId, title, description, type, timeLimit, passingScore } =
        req.body;

      // Check if lesson exists (if provided)
      if (lessonId) {
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
        });

        if (!lesson) {
          return res.status(404).json({ error: "Lesson not found" });
        }
      }

      const assessment = await prisma.assessment.create({
        data: {
          lessonId,
          title,
          description,
          type,
          timeLimit,
          passingScore,
        },
      });

      res.status(201).json({
        message: "Assessment created successfully",
        assessment,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Add question to assessment (instructor/admin only)
router.post(
  "/questions",
  authenticate,
  requireInstructor,
  validate(createQuestionSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        assessmentId,
        question,
        type,
        options,
        correctAnswer,
        explanation,
        difficulty,
        points,
        order,
      } = req.body;

      // Check if assessment exists
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
      });

      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      // Validate options for multiple choice questions
      if (type === "MULTIPLE_CHOICE" && (!options || options.length < 2)) {
        return res
          .status(400)
          .json({
            error: "Multiple choice questions must have at least 2 options",
          });
      }

      const questionRecord = await prisma.question.create({
        data: {
          assessmentId,
          question,
          type,
          options: options || [],
          correctAnswer,
          explanation,
          difficulty,
          points,
          order,
        },
      });

      res.status(201).json({
        message: "Question added successfully",
        question: questionRecord,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update assessment (instructor/admin only)
router.put(
  "/:id",
  authenticate,
  requireInstructor,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const assessment = await prisma.assessment.findUnique({
        where: { id },
      });

      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      const updatedAssessment = await prisma.assessment.update({
        where: { id },
        data: updateData,
      });

      res.json({
        message: "Assessment updated successfully",
        assessment: updatedAssessment,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete assessment (instructor/admin only)
router.delete(
  "/:id",
  authenticate,
  requireInstructor,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      const assessment = await prisma.assessment.findUnique({
        where: { id },
      });

      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      await prisma.assessment.delete({
        where: { id },
      });

      res.json({ message: "Assessment deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// Generate adaptive assessment based on user performance
router.post(
  "/adaptive/generate",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const { examType, difficulty = "MEDIUM", questionCount = 5 } = req.body;

      // Get user's performance history
      const userResults = await prisma.assessmentResult.findMany({
        where: {
          userId,
          assessment: {
            lesson: {
              course: {
                examType,
              },
            },
          },
        },
        include: {
          answers: {
            include: {
              question: {
                select: {
                  difficulty: true,
                  type: true,
                },
              },
            },
          },
        },
        orderBy: { completedAt: "desc" },
        take: 10,
      });

      // Analyze user's weak areas
      const weakAreas: string[] = [];
      const topicPerformance = new Map();

      userResults.forEach((result) => {
        result.answers.forEach((answer) => {
          if (!answer.isCorrect) {
            const topic = `${answer.question.difficulty}_questions`;
            topicPerformance.set(topic, (topicPerformance.get(topic) || 0) + 1);
          }
        });
      });

      // Convert weak areas to array
      Array.from(topicPerformance.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([topic]) => weakAreas.push(topic));

      // If no weak areas identified, use general topics
      if (weakAreas.length === 0) {
        weakAreas.push("general_knowledge", "problem_solving");
      }

      // Use Google AI to generate questions
      const { googleAI } = await import("../lib/googleAI.js");
      const aiResponse = await googleAI.generateAdaptiveQuestions(
        examType,
        difficulty,
        weakAreas,
        questionCount,
      );

      let questions: any[] = [];
      
      if (aiResponse.success && aiResponse.content) {
        try {
          // Parse AI-generated questions
          const aiQuestions = JSON.parse(aiResponse.content);
          questions = aiQuestions.map((q: any, index: number) => ({
            id: `ai_${Date.now()}_${index}`,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty || difficulty,
            type: 'multiple-choice'
          }));
        } catch (parseError) {
          console.error('Failed to parse AI questions:', parseError);
          // Fallback to existing questions
          const existingQuestions = await prisma.question.findMany({
            where: {
              assessment: {
                lesson: {
                  course: {
                    examType,
                  },
                },
              },
              difficulty: difficulty as any,
            },
            take: questionCount,
            orderBy: { createdAt: "desc" },
          });
          questions = existingQuestions;
        }
      } else {
        // Fallback to existing questions if AI fails
        const existingQuestions = await prisma.question.findMany({
          where: {
            assessment: {
              lesson: {
                course: {
                  examType,
                },
              },
            },
            difficulty: difficulty as any,
          },
          take: questionCount,
          orderBy: { createdAt: "desc" },
        });
        questions = existingQuestions;
      }

      // Create assessment record
      const assessment = await prisma.assessment.create({
        data: {
          title: `Adaptive ${examType} Assessment`,
          description: "AI-generated assessment based on your learning progress",
          type: "ADAPTIVE",
          timeLimit: questionCount * 2,
          passingScore: 70,
        },
      });

      res.status(201).json({
        message: "Adaptive assessment generated successfully",
        assessment: {
          ...assessment,
          questions: questions,
        },
        aiGenerated: aiResponse.success,
        weakAreas: weakAreas,
      });
    } catch (error) {
      console.error("Error generating adaptive assessment:", error);
      res.status(500).json({ 
        error: "Failed to generate adaptive assessment",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export default router;

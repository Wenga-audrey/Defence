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
const createLessonSchema = z.object({
  body: z.object({
    courseId: z.string(),
    title: z.string().min(1),
    content: z.string().min(1),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
    order: z.number().positive(),
    duration: z.number().positive(),
    lessonType: z
      .enum(["TEXT", "VIDEO", "AUDIO", "INTERACTIVE"])
      .default("TEXT"),
  }),
});

const updateLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
    order: z.number().positive().optional(),
    duration: z.number().positive().optional(),
    lessonType: z.enum(["TEXT", "VIDEO", "AUDIO", "INTERACTIVE"]).optional(),
    isPublished: z.boolean().optional(),
  }),
});

// Get lessons for a course
router.get("/course/:courseId", async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { includeUnpublished = "false" } = req.query;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const where: any = { courseId };
    if (includeUnpublished !== "true") {
      where.isPublished = true;
    }

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            assessments: true,
          },
        },
      },
    });

    res.json({ lessons });
  } catch (error) {
    next(error);
  }
});

// Get single lesson by ID
router.get("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            examType: true,
            level: true,
          },
        },
        assessments: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            type: true,
            timeLimit: true,
            passingScore: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    if (!lesson.isPublished) {
      return res.status(404).json({ error: "Lesson not available" });
    }

    // Check if user is enrolled in the course
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
          error: "You must be enrolled in the course to access this lesson",
        });
    }

    // Record study session
    await prisma.studySession.create({
      data: {
        userId,
        lessonId: id,
        startTime: new Date(),
        endTime: new Date(),
        duration: 0, // Will be updated when session ends
      },
    });

    res.json({ lesson });
  } catch (error) {
    next(error);
  }
});

// Create new lesson (instructor/admin only)
router.post(
  "/",
  authenticate,
  requireInstructor,
  validate(createLessonSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        courseId,
        title,
        content,
        videoUrl,
        audioUrl,
        order,
        duration,
        lessonType,
      } = req.body;

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      const lesson = await prisma.lesson.create({
        data: {
          courseId,
          title,
          content,
          videoUrl,
          audioUrl,
          order,
          duration,
          lessonType,
        },
      });

      res.status(201).json({
        message: "Lesson created successfully",
        lesson,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update lesson (instructor/admin only)
router.put(
  "/:id",
  authenticate,
  requireInstructor,
  validate(updateLessonSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingLesson = await prisma.lesson.findUnique({
        where: { id },
      });

      if (!existingLesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      const lesson = await prisma.lesson.update({
        where: { id },
        data: updateData,
      });

      res.json({
        message: "Lesson updated successfully",
        lesson,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete lesson (instructor/admin only)
router.delete(
  "/:id",
  authenticate,
  requireInstructor,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      const lesson = await prisma.lesson.findUnique({
        where: { id },
      });

      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      await prisma.lesson.delete({
        where: { id },
      });

      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// Start study session
router.post(
  "/:id/start-session",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Check if lesson exists and user is enrolled
      const lesson = await prisma.lesson.findUnique({
        where: { id },
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
            error:
              "You must be enrolled in the course to start a study session",
          });
      }

      const session = await prisma.studySession.create({
        data: {
          userId,
          lessonId: id,
          startTime: new Date(),
          endTime: new Date(), // Will be updated when session ends
          duration: 0,
        },
      });

      res.status(201).json({
        message: "Study session started",
        sessionId: session.id,
      });
    } catch (error) {
      next(error);
    }
  },
);

// End study session
router.put(
  "/session/:sessionId/end",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.id;

      const session = await prisma.studySession.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.userId !== userId) {
        return res.status(404).json({ error: "Study session not found" });
      }

      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - session.startTime.getTime()) / 60000,
      ); // minutes

      const updatedSession = await prisma.studySession.update({
        where: { id: sessionId },
        data: {
          endTime,
          duration,
        },
      });

      // Update user's streak
      const today = new Date().toDateString();
      const streak = await prisma.streak.findUnique({
        where: { userId },
      });

      if (streak) {
        const lastStudyDate = streak.lastStudyDate?.toDateString();
        let newCurrentDays = streak.currentDays;

        if (lastStudyDate !== today) {
          if (
            lastStudyDate === new Date(Date.now() - 86400000).toDateString()
          ) {
            // Consecutive day
            newCurrentDays += 1;
          } else {
            // Streak broken
            newCurrentDays = 1;
          }

          await prisma.streak.update({
            where: { userId },
            data: {
              currentDays: newCurrentDays,
              longestDays: Math.max(streak.longestDays, newCurrentDays),
              lastStudyDate: new Date(),
            },
          });
        }
      }

      res.json({
        message: "Study session ended",
        session: updatedSession,
        duration,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get user's study sessions
router.get(
  "/my/sessions",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const { page = "1", limit = "20", lessonId } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = { userId };
      if (lessonId) {
        where.lessonId = lessonId;
      }

      const [sessions, total] = await Promise.all([
        prisma.studySession.findMany({
          where,
          skip,
          take,
          orderBy: { startTime: "desc" },
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        }),
        prisma.studySession.count({ where }),
      ]);

      res.json({
        sessions,
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
  },
);

export default router;

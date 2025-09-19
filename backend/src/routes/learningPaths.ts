import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// Validation schemas
const createLearningPathSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    examType: z.enum([
      "ENAM",
      "ENS",
      "POLICE",
      "CUSTOMS",
      "UNIVERSITY",
      "PROFESSIONAL",
    ]),
    targetDate: z.string().datetime().optional(),
    courseIds: z.array(z.string()).min(1),
  }),
});

const updateLearningPathSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    targetDate: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Get user's learning paths
router.get("/my", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { isActive } = req.query;

    const where: any = { userId };
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const learningPaths = await prisma.learningPath.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          orderBy: { order: "asc" },
          include: {
            // We'll need to join with courses manually since courseId is just a string
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    // Get course details for each learning path item
    for (const path of learningPaths) {
      for (const item of path.items) {
        const course = await prisma.course.findUnique({
          where: { id: item.courseId },
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            duration: true,
            level: true,
          },
        });
        (item as any).course = course;
      }
    }

    res.json({ learningPaths });
  } catch (error) {
    next(error);
  }
});

// Get single learning path
router.get("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const learningPath = await prisma.learningPath.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!learningPath || learningPath.userId !== userId) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    // Get course details for each item
    for (const item of learningPath.items) {
      const course = await prisma.course.findUnique({
        where: { id: item.courseId },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          duration: true,
          level: true,
        },
      });
      (item as any).course = course;

      // Check if user has completed this course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: item.courseId,
          },
        },
      });
      (item as any).enrollment = enrollment;
    }

    res.json({ learningPath });
  } catch (error) {
    next(error);
  }
});

// Create learning path
router.post(
  "/",
  authenticate,
  validate(createLearningPathSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { name, description, examType, targetDate, courseIds } = req.body;
      const userId = req.user!.id;

      // Verify all courses exist
      const courses = await prisma.course.findMany({
        where: {
          id: { in: courseIds },
          isPublished: true,
        },
      });

      if (courses.length !== courseIds.length) {
        return res
          .status(400)
          .json({ error: "One or more courses not found or not published" });
      }

      const learningPath = await prisma.learningPath.create({
        data: {
          userId,
          name,
          description,
          examType,
          targetDate: targetDate ? new Date(targetDate) : null,
          items: {
            create: courseIds.map((courseId: string, index: number) => ({
              courseId,
              order: index + 1,
            })),
          },
        },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      });

      res.status(201).json({
        message: "Learning path created successfully",
        learningPath,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update learning path
router.put(
  "/:id",
  authenticate,
  validate(updateLearningPathSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { targetDate, ...updateData } = req.body;

      const existingPath = await prisma.learningPath.findUnique({
        where: { id },
      });

      if (!existingPath || existingPath.userId !== userId) {
        return res.status(404).json({ error: "Learning path not found" });
      }

      const learningPath = await prisma.learningPath.update({
        where: { id },
        data: {
          ...updateData,
          targetDate: targetDate ? new Date(targetDate) : undefined,
        },
      });

      res.json({
        message: "Learning path updated successfully",
        learningPath,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete learning path
router.delete("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const learningPath = await prisma.learningPath.findUnique({
      where: { id },
    });

    if (!learningPath || learningPath.userId !== userId) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    await prisma.learningPath.delete({
      where: { id },
    });

    res.json({ message: "Learning path deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Mark learning path item as completed
router.put(
  "/:pathId/items/:itemId/complete",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { pathId, itemId } = req.params;
      const userId = req.user!.id;

      // Verify learning path belongs to user
      const learningPath = await prisma.learningPath.findUnique({
        where: { id: pathId },
      });

      if (!learningPath || learningPath.userId !== userId) {
        return res.status(404).json({ error: "Learning path not found" });
      }

      const item = await prisma.learningPathItem.update({
        where: { id: itemId },
        data: { isCompleted: true },
      });

      res.json({
        message: "Learning path item marked as completed",
        item,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Generate AI-recommended learning path
router.post("/generate", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { examType, targetDate, availableHours = 2 } = req.body;

    // Get user's current level and preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentLevel: true,
        examTargets: true,
        learningGoals: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's assessment history to determine strengths/weaknesses
    const assessmentResults = await prisma.assessmentResult.findMany({
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
        assessment: {
          include: {
            lesson: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 20,
    });

    // Analyze performance to identify weak areas
    const coursePerformance = new Map();
    const weakAreas: string[] = [];

    assessmentResults.forEach((result) => {
      if (result.assessment.lesson?.course) {
        const courseId = result.assessment.lesson.course.id;
        const existing = coursePerformance.get(courseId) || {
          total: 0,
          count: 0,
        };
        coursePerformance.set(courseId, {
          total: existing.total + result.score,
          count: existing.count + 1,
          course: result.assessment.lesson.course,
        });
      }
    });

    // Extract weak areas
    Array.from(coursePerformance.entries())
      .filter(([_, perf]) => perf.total / perf.count < 70)
      .forEach(([_, perf]) => weakAreas.push(perf.course.title));

    if (weakAreas.length === 0) {
      weakAreas.push("general preparation", "exam fundamentals");
    }

    // Use Google AI to generate personalized learning path
    const { googleAI } = await import("../lib/googleAI.js");
    const aiResponse = await googleAI.generateLearningPath(
      user,
      examType,
      weakAreas,
      availableHours,
    );

    // Get recommended courses based on exam type and user level
    const recommendedCourses = await prisma.course.findMany({
      where: {
        examType,
        level: user.currentLevel,
        isPublished: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // Prioritize courses based on performance (put weaker areas first)
    const sortedCourses = recommendedCourses.sort((a, b) => {
      const aPerf = coursePerformance.get(a.id);
      const bPerf = coursePerformance.get(b.id);

      if (!aPerf && !bPerf) return 0;
      if (!aPerf) return -1; // Prioritize courses not taken
      if (!bPerf) return 1;

      const aAvg = aPerf.total / aPerf.count;
      const bAvg = bPerf.total / bPerf.count;

      return aAvg - bAvg; // Lower scores first (weaker areas)
    });

    // Calculate optimal scheduling based on available hours and target date
    const totalDuration = sortedCourses.reduce(
      (sum, course) => sum + course.duration,
      0,
    );
    const daysUntilTarget = targetDate
      ? Math.ceil(
          (new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        )
      : 90; // Default 3 months

    const dailyHours = Math.min(
      availableHours,
      totalDuration / Math.max(daysUntilTarget, 1),
    );

    // Create the learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        userId,
        name: `AI-Generated ${examType} Study Plan`,
        description: aiResponse.success
          ? `Personalized learning path created by AI analysis. ${totalDuration} hours over ${daysUntilTarget} days.`
          : `Personalized learning path for ${examType} exam preparation. Estimated ${totalDuration} hours of study over ${daysUntilTarget} days.`,
        examType,
        targetDate: targetDate ? new Date(targetDate) : null,
        items: {
          create: sortedCourses.map((course, index) => ({
            courseId: course.id,
            order: index + 1,
            scheduledDate: targetDate
              ? new Date(Date.now() + index * 7 * 24 * 60 * 60 * 1000)
              : null, // Weekly intervals
          })),
        },
      },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    let aiInsights = null;
    if (aiResponse.success) {
      try {
        aiInsights = JSON.parse(aiResponse.content || "{}");
      } catch (parseError) {
        console.error("Failed to parse AI learning path response:", parseError);
      }
    }

    res.status(201).json({
      message: "AI-generated learning path created successfully",
      learningPath,
      recommendations: {
        estimatedDuration: totalDuration,
        dailyHours: Math.round(dailyHours * 10) / 10,
        daysUntilTarget,
        weakAreas,
        aiInsights: (aiInsights as any)?.studyPlan || null,
      },
      aiGenerated: aiResponse.success,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// Get user dashboard data
router.get("/dashboard", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get user's basic info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        currentLevel: true,
        examTargets: true,
        availableHours: true,
      },
    });

    // Get enrollment statistics
    const enrollmentStats = await prisma.enrollment.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    });

    // Get recent study sessions
    const recentSessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 5,
      include: {
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
    });

    // Get current streak
    const streak = await prisma.streak.findUnique({
      where: { userId },
    });

    // Get recent assessment results
    const recentResults = await prisma.assessmentResult.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: {
        assessment: {
          select: {
            title: true,
            type: true,
            passingScore: true,
          },
        },
      },
    });

    // Get active learning paths
    const activeLearningPaths = await prisma.learningPath.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        items: {
          select: {
            isCompleted: true,
          },
        },
      },
    });

    // Calculate progress for each learning path
    const learningPathsWithProgress = activeLearningPaths.map((path) => ({
      ...path,
      progress:
        path.items.length > 0
          ? Math.round(
              (path.items.filter((item) => item.isCompleted).length /
                path.items.length) *
                100,
            )
          : 0,
    }));

    // Get upcoming scheduled items
    const upcomingItems = await prisma.learningPathItem.findMany({
      where: {
        learningPath: {
          userId,
          isActive: true,
        },
        isCompleted: false,
        scheduledDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
      orderBy: { scheduledDate: "asc" },
      take: 5,
      include: {
        learningPath: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      user,
      stats: {
        enrollments: enrollmentStats.reduce((acc, stat) => {
          acc[stat.status.toLowerCase()] = stat._count.status;
          return acc;
        }, {} as any),
        currentStreak: streak?.currentDays || 0,
        longestStreak: streak?.longestDays || 0,
        totalStudyTime: recentSessions.reduce(
          (sum, session) => sum + session.duration,
          0,
        ),
      },
      recentActivity: {
        studySessions: recentSessions,
        assessmentResults: recentResults,
      },
      learningPaths: learningPathsWithProgress,
      upcomingItems,
    });
  } catch (error) {
    next(error);
  }
});

// Get user notifications
router.get(
  "/notifications",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const { page = "1", limit = "20", unreadOnly = "false" } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = { userId };
      if (unreadOnly === "true") {
        where.isRead = false;
      }

      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
          where: { userId, isRead: false },
        }),
      ]);

      res.json({
        notifications,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Mark notification as read
router.put(
  "/notifications/:id/read",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification || notification.userId !== userId) {
        return res.status(404).json({ error: "Notification not found" });
      }

      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      res.json({ message: "Notification marked as read" });
    } catch (error) {
      next(error);
    }
  },
);

// Mark all notifications as read
router.put(
  "/notifications/read-all",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  },
);

// Get user achievements
router.get(
  "/achievements",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;

      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: true,
        },
        orderBy: { unlockedAt: "desc" },
      });

      // Get all available achievements
      const allAchievements = await prisma.achievement.findMany({
        orderBy: { points: "desc" },
      });

      const unlockedIds = new Set(
        userAchievements.map((ua) => ua.achievementId),
      );
      const availableAchievements = allAchievements.filter(
        (a) => !unlockedIds.has(a.id),
      );

      res.json({
        unlocked: userAchievements,
        available: availableAchievements,
        totalPoints: userAchievements.reduce(
          (sum, ua) => sum + ua.achievement.points,
          0,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get user progress analytics
router.get("/analytics", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { period = "30" } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    // Study time analytics
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: { gte: startDate },
      },
      orderBy: { startTime: "asc" },
    });

    // Assessment performance analytics
    const assessmentResults = await prisma.assessmentResult.findMany({
      where: {
        userId,
        completedAt: { gte: startDate },
      },
      include: {
        assessment: {
          select: {
            type: true,
            lesson: {
              select: {
                course: {
                  select: {
                    examType: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { completedAt: "asc" },
    });

    // Group study sessions by date
    const dailyStudyTime = studySessions.reduce(
      (acc, session) => {
        const date = session.startTime.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + session.duration;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Group assessment scores by exam type
    const scoresByExamType = assessmentResults.reduce(
      (acc, result) => {
        const examType =
          result.assessment.lesson?.course?.examType || "GENERAL";
        if (!acc[examType]) acc[examType] = [];
        acc[examType].push(result.score);
        return acc;
      },
      {} as Record<string, number[]>,
    );

    // Calculate averages
    const averageScores = Object.entries(scoresByExamType).reduce(
      (acc, [examType, scores]) => {
        acc[examType] =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return acc;
      },
      {} as Record<string, number>,
    );

    res.json({
      studyTime: {
        daily: dailyStudyTime,
        total: Object.values(dailyStudyTime).reduce(
          (sum, time) => sum + time,
          0,
        ),
        average:
          Object.values(dailyStudyTime).reduce((sum, time) => sum + time, 0) /
          parseInt(period as string),
      },
      assessments: {
        total: assessmentResults.length,
        averageScores,
        recentTrend: assessmentResults.slice(-10).map((r) => ({
          date: r.completedAt.toISOString().split("T")[0],
          score: r.score,
        })),
      },
      streak: await prisma.streak.findUnique({
        where: { userId },
      }),
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all users (admin only)
router.get(
  "/admin/all",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const { page = "1", limit = "20", search, role } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = {};
      if (search) {
        where.OR = [
          { firstName: { contains: search as string, mode: "insensitive" } },
          { lastName: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      if (role) {
        where.role = role;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            currentLevel: true,
            createdAt: true,
            isEmailVerified: true,
            _count: {
              select: {
                enrollments: true,
                assessmentResults: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        users,
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

// Admin: Update user role (admin only)
router.put(
  "/admin/:userId/role",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["LEARNER", "TEACHER", "SUPER_ADMIN"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      res.json({
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

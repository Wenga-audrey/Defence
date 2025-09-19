import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Update learner level
router.patch("/learner-level", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { learnerLevel } = req.body;

    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(learnerLevel)) {
      return res.status(400).json({ error: "Invalid learner level" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { learnerLevel },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        learnerLevel: true,
        preferredExams: true
      }
    });

    res.json({
      success: true,
      data: user,
      message: `Learner level updated to ${learnerLevel}`
    });
  } catch (error) {
    next(error);
  }
});

// Update preferred exams
router.patch("/preferred-exams", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { preferredExams } = req.body;

    if (!Array.isArray(preferredExams)) {
      return res.status(400).json({ error: "Preferred exams must be an array" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferredExams },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        learnerLevel: true,
        preferredExams: true
      }
    });

    res.json({
      success: true,
      data: user,
      message: "Preferred exams updated successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Get learner dashboard data
router.get("/dashboard", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const [user, enrollments, recentResults] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          learnerLevel: true,
          preferredExams: true,
          createdAt: true
        }
      }),
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              examModule: true,
              _count: {
                select: { lessons: true }
              }
            }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      }),
      prisma.assessmentResult.findMany({
        where: { userId },
        include: {
          assessment: {
            include: {
              course: {
                select: { title: true, examType: true }
              }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: 5
      })
    ]);

    const dashboardData = {
      user,
      enrollments: enrollments.map(enrollment => ({
        id: enrollment.id,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          examType: enrollment.course.examType,
          difficulty: enrollment.course.difficulty,
          examModule: enrollment.course.examModule
        },
        progress: enrollment.progress,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        totalLessons: enrollment.course._count.lessons
      })),
      recentResults: recentResults.map(result => ({
        id: result.id,
        score: result.score,
        totalPoints: result.totalPoints,
        percentage: Math.round((result.score / result.totalPoints) * 100),
        completedAt: result.completedAt,
        courseTitle: result.assessment.course?.title,
        examType: result.assessment.course?.examType
      }))
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
});

export default router;

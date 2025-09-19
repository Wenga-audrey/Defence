import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Get admin dashboard statistics
router.get("/dashboard", async (req: AuthRequest, res, next) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalAssessments,
      activeSubscriptions,
      recentUsers,
      recentEnrollments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.assessmentResult.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    // Get user growth over last 12 months
    const userGrowth = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: { createdAt: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Last year
        },
      },
    });

    // Get revenue data (from active subscriptions)
    const revenueData = await prisma.subscription.groupBy({
      by: ["planType"],
      _count: { planType: true },
      where: { status: "ACTIVE" },
    });

    // Calculate estimated monthly revenue
    const planPrices = { MONTHLY: 9.99, ANNUAL: 8.33, LIFETIME: 0, FREE: 0 }; // Annual divided by 12
    const estimatedRevenue = revenueData.reduce((total, plan) => {
      return (
        total +
        planPrices[plan.planType as keyof typeof planPrices] *
          plan._count.planType
      );
    }, 0);

    res.json({
      overview: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalAssessments,
        activeSubscriptions,
        estimatedMonthlyRevenue: Math.round(estimatedRevenue * 100) / 100,
      },
      growth: {
        newUsersLast30Days: recentUsers,
        newEnrollmentsLast30Days: recentEnrollments,
        userGrowthTrend: userGrowth,
      },
      revenue: {
        byPlan: revenueData,
        estimated: estimatedRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Content management - Get all courses with detailed info
router.get("/courses", async (req: AuthRequest, res, next) => {
  try {
    const {
      page = "1",
      limit = "20",
      search,
      examType,
      isPublished,
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (examType) where.examType = examType;
    if (isPublished !== undefined) where.isPublished = isPublished === "true";

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        include: {
          categories: true,
          subjects: true,
          teachers: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          _count: {
            select: {
              lessons: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.count({ where }),
    ]);

    res.json({
      courses,
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

// Bulk publish/unpublish courses
router.put("/courses/bulk-publish", async (req: AuthRequest, res, next) => {
  try {
    const { courseIds, isPublished } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: "Course IDs array is required" });
    }

    await prisma.course.updateMany({
      where: { id: { in: courseIds } },
      data: { isPublished },
    });

    res.json({
      message: `${courseIds.length} courses ${isPublished ? "published" : "unpublished"} successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// User management - Get detailed user list
router.get("/users", async (req: AuthRequest, res, next) => {
  try {
    const { page = "1", limit = "20", search, role, isActive } = req.query;

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
    if (role) where.role = role;

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
          isEmailVerified: true,
          createdAt: true,
          _count: {
            select: {
              enrollments: true,
              assessmentResults: true,
              subscriptions: true,
            },
          },
          subscriptions: {
            where: { status: "ACTIVE" },
            select: {
              planType: true,
              endDate: true,
            },
            take: 1,
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
});

// Delete user account
router.delete("/users/:userId", async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user!.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user and all related data (cascading deletes handled by Prisma)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// System notifications - Send notification to all users
router.post("/notifications/broadcast", async (req: AuthRequest, res, next) => {
  try {
    const { title, message, type = "SYSTEM", userIds } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    let targetUsers;
    if (userIds && Array.isArray(userIds)) {
      targetUsers = userIds;
    } else {
      // Get all user IDs
      const users = await prisma.user.findMany({
        select: { id: true },
      });
      targetUsers = users.map((u) => u.id);
    }

    // Create notifications for all users
    const notifications = targetUsers.map((userId) => ({
      userId,
      title,
      message,
      type,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    res.json({
      message: `Notification sent to ${targetUsers.length} users`,
      count: targetUsers.length,
    });
  } catch (error) {
    next(error);
  }
});

// Achievement management - Create new achievement
router.post("/achievements", async (req: AuthRequest, res, next) => {
  try {
    const { name, description, icon, condition, points } = req.body;

    if (!name || !description || !condition) {
      return res
        .status(400)
        .json({ error: "Name, description, and condition are required" });
    }

    const achievement = await prisma.achievement.create({
      data: {
        name,
        description,
        icon: icon || "🏆",
        condition: JSON.stringify(condition),
        points: points || 10,
      },
    });

    res.status(201).json({
      message: "Achievement created successfully",
      achievement,
    });
  } catch (error) {
    next(error);
  }
});

// Get all achievements
router.get("/achievements", async (req: AuthRequest, res, next) => {
  try {
    const achievements = await prisma.achievement.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ achievements });
  } catch (error) {
    next(error);
  }
});

// System settings and configuration
router.get("/settings", async (req: AuthRequest, res, next) => {
  try {
    // This would typically come from a settings table or configuration
    const settings = {
      platform: {
        name: "Mindboost",
        version: "1.0.0",
        maintenanceMode: false,
      },
      features: {
        registrationEnabled: true,
        paymentEnabled: true,
        emailNotifications: true,
        aiRecommendations: true,
      },
      limits: {
        maxCoursesPerUser: 100,
        maxAssessmentAttempts: 3,
        maxFileUploadSize: "10MB",
      },
    };

    res.json({ settings });
  } catch (error) {
    next(error);
  }
});

// Update system settings
router.put("/settings", async (req: AuthRequest, res, next) => {
  try {
    const { settings } = req.body;

    // In a real application, you would save these to a settings table
    // For now, we'll just return success
    console.log("Settings updated:", settings);

    res.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
});

// Export data for analytics
router.get("/export/users", async (req: AuthRequest, res, next) => {
  try {
    const { format = "json", startDate, endDate } = req.query;

    const where: any = {};
    if (startDate) where.createdAt = { gte: new Date(startDate as string) };
    if (endDate) {
      where.createdAt = where.createdAt || {};
      where.createdAt.lte = new Date(endDate as string);
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        currentLevel: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            assessmentResults: true,
          },
        },
      },
    });

    if (format === "csv") {
      // Convert to CSV format
      const csvHeader =
        "ID,Email,First Name,Last Name,Role,Level,Created At,Enrollments,Assessments\n";
      const csvData = users
        .map(
          (user) =>
            `${user.id},${user.email},${user.firstName},${user.lastName},${user.role},${user.currentLevel},${user.createdAt.toISOString()},${user._count.enrollments},${user._count.assessmentResults}`,
        )
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=users.csv");
      res.send(csvHeader + csvData);
    } else {
      res.json({ users, count: users.length });
    }
  } catch (error) {
    next(error);
  }
});

// Create preparatory class with optional subjects
router.post("/classes", async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      examType: z.string().min(1),
      level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).or(z.string()),
      duration: z.number().min(1),
      price: z.number().optional(),
      isPublished: z.boolean().optional(),
      subjects: z
        .array(
          z.object({
            name: z.string().min(1),
            description: z.string().optional(),
          }),
        )
        .optional(),
    });
    const body = schema.parse(req.body);

    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        examType: body.examType,
        level: body.level,
        duration: body.duration,
        price: body.price,
        isPublished: body.isPublished ?? false,
        subjects:
          body.subjects && body.subjects.length > 0
            ? {
                create: body.subjects.map((s) => ({
                  name: s.name,
                  description: s.description,
                })),
              }
            : undefined,
      },
      include: { subjects: true },
    });

    res.status(201).json({ message: "Class created successfully", course });
  } catch (error) {
    next(error);
  }
});

// Add subjects to a class
router.post("/classes/:id/subjects", async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const schema = z.object({
      subjects: z.array(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
        }),
      ),
    });
    const body = schema.parse(req.body);

    const created = await prisma.subject.createMany({
      data: body.subjects.map((s) => ({
        courseId: id,
        name: s.name,
        description: s.description,
      })),
    });

    res
      .status(201)
      .json({
        message: `Added ${created.count} subjects`,
        count: created.count,
      });
  } catch (error) {
    next(error);
  }
});

// Assign instructor to a class
router.post(
  "/classes/:id/assign-instructor",
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const schema = z.object({ instructorId: z.string().min(1) });
      const { instructorId } = schema.parse(req.body);

      const instructor = await prisma.user.findUnique({
        where: { id: instructorId },
      });
      if (
        !instructor ||
        (instructor.role !== "TEACHER" &&
          instructor.role !== "SUPER_ADMIN")
      ) {
        return res.status(400).json({ error: "Invalid instructor user" });
      }

      const assignment = await prisma.courseTeacher.upsert({
        where: { courseId_userId: { courseId: id, userId: instructorId } },
        update: {},
        create: { courseId: id, userId: instructorId, role: "TEACHER" },
      });

      res.status(201).json({ message: "Instructor assigned", assignment });
    } catch (error) {
      next(error);
    }
  },
);

// Teacher Management Routes

// Get all teachers
router.get("/teachers", async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      role: "TEACHER"
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } }
      ];
    }

    const [teachers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          createdAt: true,
          teaching: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  examType: true
                }
              }
            }
          },
          _count: {
            select: {
              teaching: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        teachers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Assign teacher to course
router.post("/teachers/:teacherId/courses/:courseId", async (req: AuthRequest, res, next) => {
  try {
    const { teacherId, courseId } = req.params;

    // Verify teacher exists and has INSTRUCTOR role
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
      select: { id: true, role: true, firstName: true, lastName: true }
    });

    if (!teacher || teacher.role !== "TEACHER") {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true }
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.courseTeacher.findUnique({
      where: {
        courseId_teacherId: {
          courseId,
          teacherId
        }
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: "Teacher is already assigned to this course" });
    }

    // Create assignment
    const assignment = await prisma.courseTeacher.create({
      data: {
        courseId,
        teacherId,
        assignedAt: new Date()
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            examType: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: `${teacher.firstName} ${teacher.lastName} has been assigned to ${course.title}`
    });
  } catch (error) {
    next(error);
  }
});

// Remove teacher from course
router.delete("/teachers/:teacherId/courses/:courseId", async (req: AuthRequest, res, next) => {
  try {
    const { teacherId, courseId } = req.params;

    const assignment = await prisma.courseTeacher.findUnique({
      where: {
        courseId_teacherId: {
          courseId,
          teacherId
        }
      },
      include: {
        teacher: {
          select: { firstName: true, lastName: true }
        },
        course: {
          select: { title: true }
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({ error: "Teacher assignment not found" });
    }

    await prisma.courseTeacher.delete({
      where: {
        courseId_teacherId: {
          courseId,
          teacherId
        }
      }
    });

    res.json({
      success: true,
      message: `${assignment.teacher.firstName} ${assignment.teacher.lastName} has been removed from ${assignment.course.title}`
    });
  } catch (error) {
    next(error);
  }
});

// Get course assignments
router.get("/courses/:courseId/teachers", async (req: AuthRequest, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
          examType: course.examType
        },
        teachers: course.teachers.map(assignment => ({
          ...assignment.teacher,
          assignedAt: assignment.assignedAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Promote user to instructor
router.post("/users/:userId/promote-instructor", async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, firstName: true, lastName: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "TEACHER") {
      return res.status(400).json({ error: "User is already an instructor" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "TEACHER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });

    res.json({
      success: true,
      data: updatedUser,
      message: `${user.firstName} ${user.lastName} has been promoted to instructor`
    });
  } catch (error) {
    next(error);
  }
});

export default router;

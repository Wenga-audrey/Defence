import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateLearningPathData {
  name: string;
  description?: string;
  examType: string;
  targetDate?: Date;
  userId: string;
  courseIds: string[];
}

export class LearningPathModel {
  static async findById(id: string) {
    return await prisma.learningPath.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            // course: {
            //   select: {
            //     id: true,
            //     title: true,
            //     thumbnail: true,
            //     duration: true,
            //     level: true,
            //     examType: true,
            //   },
            // },
          },
          orderBy: { order: "asc" },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            currentLevel: true,
            examTargets: true,
          },
        },
      },
    });
  }

  static async findByUserId(userId: string) {
    return await prisma.learningPath.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            // course: {
            //   select: {
            //     id: true,
            //     title: true,
            //     thumbnail: true,
            //     duration: true,
            //     level: true,
            //   },
            // },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(pathData: CreateLearningPathData) {
    return await prisma.learningPath.create({
      data: {
        name: pathData.name,
        description: pathData.description,
        examType: pathData.examType,
        targetDate: pathData.targetDate,
        userId: pathData.userId,
        items: {
          create: pathData.courseIds.map((courseId, index) => ({
            courseId,
            order: index + 1,
            scheduledDate: pathData.targetDate
              ? new Date(Date.now() + index * 7 * 24 * 60 * 60 * 1000) // Weekly intervals
              : null,
          })),
        },
      },
      include: {
        items: {
          include: {
            // course: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  static async generatePersonalized(
    userId: string,
    examType: string,
    targetDate?: Date,
    availableHours: number = 2,
  ) {
    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentLevel: true,
        examTargets: true,
        learningGoals: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's assessment history
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

    // Analyze performance
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

    // Get recommended courses
    const recommendedCourses = await prisma.course.findMany({
      where: {
        examType,
        level: user.currentLevel,
        isPublished: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // Sort courses by performance (weaker areas first)
    const sortedCourses = recommendedCourses.sort((a, b) => {
      const aPerf = coursePerformance.get(a.id);
      const bPerf = coursePerformance.get(b.id);

      if (!aPerf && !bPerf) return 0;
      if (!aPerf) return -1;
      if (!bPerf) return 1;

      const aAvg = aPerf.total / aPerf.count;
      const bAvg = bPerf.total / bPerf.count;

      return aAvg - bAvg;
    });

    // Use Google AI for personalized recommendations
    let aiInsights = null;
    try {
      const { googleAI } = await import("../lib/googleAI.js");
      const aiResponse = await googleAI.generateLearningPath(
        user,
        examType,
        weakAreas,
        availableHours,
      );

      if (aiResponse.success) {
        aiInsights = JSON.parse(aiResponse.content || "{}");
      }
    } catch (error) {
      console.error("AI learning path generation failed:", error);
    }

    // Calculate scheduling
    const totalDuration = sortedCourses.reduce(
      (sum, course) => sum + course.duration,
      0,
    );
    const daysUntilTarget = targetDate
      ? Math.ceil(
          (new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        )
      : 90;

    const dailyHours = Math.min(
      availableHours,
      totalDuration / Math.max(daysUntilTarget, 1),
    );

    // Create learning path
    const learningPath = await this.create({
      name: `AI-Generated ${examType} Study Plan`,
      description: `Personalized learning path created by AI analysis. ${totalDuration} hours over ${daysUntilTarget} days.`,
      examType,
      targetDate,
      userId,
      courseIds: sortedCourses.map((course) => course.id),
    });

    return {
      learningPath,
      recommendations: {
        estimatedDuration: totalDuration,
        dailyHours: Math.round(dailyHours * 10) / 10,
        daysUntilTarget,
        weakAreas,
        aiInsights: aiInsights || null,
      },
      aiGenerated: !!aiInsights,
    };
  }

  static async updateProgress(id: string, itemId: string, completed: boolean) {
    await prisma.learningPathItem.update({
      where: { id: itemId },
      data: {
        isCompleted: completed,
      },
    });

    // Update overall progress
    const pathWithItems = await this.findById(id);
    if (pathWithItems) {
      const completedItems = pathWithItems.items.filter(
        (item) => item.isCompleted,
      ).length;
      const totalItems = pathWithItems.items.length;
      const progress =
        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      // No need to update LearningPath as it doesn't have progress or completedAt fields
    }

    return this.findById(id);
  }

  static async delete(id: string) {
    return await prisma.learningPath.delete({
      where: { id },
    });
  }

  static async getRecommendations(userId: string, examType: string) {
    // Get user's current enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    // Get recommended courses not already enrolled
    const courses = await prisma.course.findMany({
      where: {
        examType,
        isPublished: true,
        id: {
          notIn: enrolledCourseIds,
        },
      },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      take: 10,
    });

    return courses;
  }
}

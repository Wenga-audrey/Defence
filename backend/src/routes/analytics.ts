import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get user's personal analytics
router.get("/personal", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { period = "30" } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    // Learning progress over time
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            examType: true,
            level: true,
          },
        },
      },
    });

    // Study time trends
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: { gte: startDate },
      },
      orderBy: { startTime: "asc" },
    });

    // Assessment performance trends
    const assessmentResults = await prisma.assessmentResult.findMany({
      where: {
        userId,
        completedAt: { gte: startDate },
      },
      include: {
        assessment: {
          select: {
            title: true,
            type: true,
            passingScore: true,
            lesson: {
              select: {
                course: {
                  select: {
                    examType: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { completedAt: "asc" },
    });

    // Streak information
    const streak = await prisma.streak.findUnique({
      where: { userId },
    });

    // Learning path progress
    const learningPaths = await prisma.learningPath.findMany({
      where: { userId },
      include: {
        items: {
          select: {
            isCompleted: true,
            scheduledDate: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalStudyTime = studySessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );
    const averageScore =
      assessmentResults.length > 0
        ? assessmentResults.reduce((sum, result) => sum + result.score, 0) /
          assessmentResults.length
        : 0;

    // Group data by exam type
    const performanceByExamType = assessmentResults.reduce(
      (acc, result) => {
        const examType =
          result.assessment.lesson?.course?.examType || "GENERAL";
        if (!acc[examType]) {
          acc[examType] = { scores: [], count: 0, average: 0 };
        }
        acc[examType].scores.push(result.score);
        acc[examType].count++;
        return acc;
      },
      {} as Record<string, any>,
    );

    // Calculate averages
    Object.keys(performanceByExamType).forEach((examType) => {
      const data = performanceByExamType[examType];
      data.average =
        data.scores.reduce((sum: number, score: number) => sum + score, 0) /
        data.count;
    });

    res.json({
      overview: {
        totalCourses: enrollments.length,
        completedCourses: enrollments.filter((e) => e.status === "COMPLETED")
          .length,
        totalStudyTime,
        averageScore: Math.round(averageScore),
        currentStreak: streak?.currentDays || 0,
        longestStreak: streak?.longestDays || 0,
      },
      trends: {
        studyTime: studySessions.map((session) => ({
          date: session.startTime.toISOString().split("T")[0],
          duration: session.duration,
        })),
        assessmentScores: assessmentResults.map((result) => ({
          date: result.completedAt.toISOString().split("T")[0],
          score: result.score,
          examType: result.assessment.lesson?.course?.examType,
        })),
      },
      performanceByExamType,
      learningPathProgress: learningPaths.map((path) => ({
        name: path.name,
        totalItems: path.items.length,
        completedItems: path.items.filter((item) => item.isCompleted).length,
        progress:
          path.items.length > 0
            ? Math.round(
                (path.items.filter((item) => item.isCompleted).length /
                  path.items.length) *
                  100,
              )
            : 0,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get platform analytics (admin only)
router.get(
  "/platform",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const { period = "30" } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period as string));

      // User statistics
      const totalUsers = await prisma.user.count();
      const newUsers = await prisma.user.count({
        where: { createdAt: { gte: startDate } },
      });

      const usersByRole = await prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      });

      // Course statistics
      const totalCourses = await prisma.course.count();
      const publishedCourses = await prisma.course.count({
        where: { isPublished: true },
      });

      const coursesByExamType = await prisma.course.groupBy({
        by: ["examType"],
        _count: { examType: true },
        where: { isPublished: true },
      });

      // Enrollment statistics
      const totalEnrollments = await prisma.enrollment.count();
      const activeEnrollments = await prisma.enrollment.count({
        where: { status: "ACTIVE" },
      });

      const enrollmentsByStatus = await prisma.enrollment.groupBy({
        by: ["status"],
        _count: { status: true },
      });

      // Assessment statistics
      const totalAssessments = await prisma.assessmentResult.count();
      const recentAssessments = await prisma.assessmentResult.count({
        where: { completedAt: { gte: startDate } },
      });

      const averageScore = await prisma.assessmentResult.aggregate({
        _avg: { score: true },
      });

      // Popular courses
      const popularCourses = await prisma.course.findMany({
        select: {
          id: true,
          title: true,
          examType: true,
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

      // Daily active users (based on study sessions)
      const dailyActiveUsers = await prisma.studySession.groupBy({
        by: ["userId"],
        where: {
          startTime: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        _count: { userId: true },
      });

      // Revenue statistics (if subscriptions are active)
      const activeSubscriptions = await prisma.subscription.count({
        where: { status: "ACTIVE" },
      });

      const subscriptionsByPlan = await prisma.subscription.groupBy({
        by: ["planType"],
        _count: { planType: true },
        where: { status: "ACTIVE" },
      });

      res.json({
        users: {
          total: totalUsers,
          new: newUsers,
          byRole: usersByRole.reduce(
            (acc, item) => {
              acc[item.role.toLowerCase()] = item._count.role;
              return acc;
            },
            {} as Record<string, number>,
          ),
          dailyActive: dailyActiveUsers.length,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          byExamType: coursesByExamType.reduce(
            (acc, item) => {
              acc[item.examType] = item._count.examType;
              return acc;
            },
            {} as Record<string, number>,
          ),
          popular: popularCourses,
        },
        enrollments: {
          total: totalEnrollments,
          active: activeEnrollments,
          byStatus: enrollmentsByStatus.reduce(
            (acc, item) => {
              acc[item.status.toLowerCase()] = item._count.status;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
        assessments: {
          total: totalAssessments,
          recent: recentAssessments,
          averageScore: Math.round(averageScore._avg.score || 0),
        },
        subscriptions: {
          active: activeSubscriptions,
          byPlan: subscriptionsByPlan.reduce(
            (acc, item) => {
              acc[item.planType.toLowerCase()] = item._count.planType;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get course analytics (instructor/admin)
router.get(
  "/courses/:courseId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { courseId } = req.params;
      const userId = req.user!.id;

      // Check if user has permission to view course analytics
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // For now, allow all authenticated users to view course analytics
      // In production, you might want to restrict this to instructors/admins

      // Enrollment statistics
      const enrollmentStats = await prisma.enrollment.groupBy({
        by: ["status"],
        where: { courseId },
        _count: { status: true },
      });

      // Completion rates
      const totalEnrollments = await prisma.enrollment.count({
        where: { courseId },
      });

      const completedEnrollments = await prisma.enrollment.count({
        where: { courseId, status: "COMPLETED" },
      });

      // Average progress
      const progressData = await prisma.enrollment.aggregate({
        where: { courseId },
        _avg: { progress: true },
      });

      // Assessment performance for this course
      const assessmentResults = await prisma.assessmentResult.findMany({
        where: {
          assessment: {
            lesson: {
              courseId,
            },
          },
        },
        include: {
          assessment: {
            select: {
              title: true,
              type: true,
            },
          },
        },
      });

      const averageAssessmentScore =
        assessmentResults.length > 0
          ? assessmentResults.reduce((sum, result) => sum + result.score, 0) /
            assessmentResults.length
          : 0;

      // Study time for this course
      const studySessions = await prisma.studySession.findMany({
        where: {
          lesson: {
            courseId,
          },
        },
      });

      const totalStudyTime = studySessions.reduce(
        (sum, session) => sum + session.duration,
        0,
      );

      res.json({
        course: {
          id: course.id,
          title: course.title,
          examType: course.examType,
          level: course.level,
        },
        enrollments: {
          total: totalEnrollments,
          byStatus: enrollmentStats.reduce(
            (acc, item) => {
              acc[item.status.toLowerCase()] = item._count.status;
              return acc;
            },
            {} as Record<string, number>,
          ),
          completionRate:
            totalEnrollments > 0
              ? Math.round((completedEnrollments / totalEnrollments) * 100)
              : 0,
          averageProgress: Math.round(progressData._avg.progress || 0),
        },
        performance: {
          averageAssessmentScore: Math.round(averageAssessmentScore),
          totalAssessments: assessmentResults.length,
          totalStudyTime,
        },
        trends: {
          enrollmentsOverTime: await prisma.enrollment.groupBy({
            by: ["enrolledAt"],
            where: { courseId },
            _count: { enrolledAt: true },
            orderBy: { enrolledAt: "asc" },
          }),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Student Dashboard Analytics Routes

// Get course progress for student dashboard
router.get("/course-progress", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            examType: true,
            thumbnail: true,
            lessons: {
              select: { id: true }
            }
          }
        },
        progress: {
          select: {
            lessonId: true,
            completedAt: true
          }
        }
      }
    });

    const courseProgress = enrollments.map(enrollment => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.progress.filter(p => p.completedAt).length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        examType: enrollment.course.examType,
        thumbnail: enrollment.course.thumbnail,
        progress,
        totalLessons,
        completedLessons,
        lastAccessed: enrollment.lastAccessedAt || enrollment.enrolledAt
      };
    });

    res.json({
      success: true,
      data: courseProgress
    });
  } catch (error) {
    next(error);
  }
});

// Get recent assessments for student dashboard
router.get("/recent-assessments", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const assessmentResults = await prisma.assessmentResult.findMany({
      where: { userId },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            course: {
              select: {
                examType: true
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 10
    });

    const recentAssessments = assessmentResults.map(result => ({
      id: result.id,
      title: result.assessment.title,
      score: result.score,
      maxScore: result.maxScore,
      completedAt: result.completedAt,
      difficulty: result.assessment.difficulty,
      subject: result.assessment.course.examType
    }));

    res.json({
      success: true,
      data: recentAssessments
    });
  } catch (error) {
    next(error);
  }
});

// Get study streak data
router.get("/study-streak", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get all study sessions
    const studySessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      select: {
        startTime: true,
        endTime: true
      }
    });

    // Calculate streak data
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalStudyDays = 0;
    let weeklyProgress = 0;

    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const studyDates = new Set<string>();

    // Process study sessions to find unique study days
    studySessions.forEach(session => {
      const sessionDate = new Date(session.startTime).toDateString();
      studyDates.add(sessionDate);

      // Count this week's study days
      if (new Date(session.startTime) >= oneWeekAgo) {
        const dayKey = new Date(session.startTime).toDateString();
        if (!studyDates.has(dayKey)) {
          weeklyProgress++;
        }
      }
    });

    totalStudyDays = studyDates.size;

    // Calculate streaks
    const sortedDates = Array.from(studyDates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    // Calculate current streak
    let currentDate = new Date();
    for (let i = 0; i < sortedDates.length; i++) {
      const studyDate = new Date(sortedDates[i]);
      const daysDiff = Math.floor((currentDate.getTime() - studyDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= i + 1) {
        currentStreak++;
        currentDate = studyDate;
      } else {
        break;
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const daysDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // Count unique days this week
    const thisWeekDates = new Set<string>();
    studySessions.forEach(session => {
      if (new Date(session.startTime) >= oneWeekAgo) {
        thisWeekDates.add(new Date(session.startTime).toDateString());
      }
    });
    weeklyProgress = thisWeekDates.size;

    res.json({
      success: true,
      data: {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        totalStudyDays,
        weeklyGoal: 5, // Default weekly goal
        weeklyProgress
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get weak areas analysis
router.get("/weak-areas", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get assessment results with questions
    const assessmentResults = await prisma.assessmentResult.findMany({
      where: { userId },
      include: {
        assessment: {
          include: {
            questions: {
              include: {
                userAnswers: {
                  where: { userId }
                }
              }
            },
            course: {
              select: { examType: true }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 20 // Analyze last 20 assessments
    });

    // Analyze performance by topic/subject
    const topicPerformance = new Map<string, {
      correct: number;
      total: number;
      subject: string;
      lastPracticed: Date;
    }>();

    assessmentResults.forEach(result => {
      result.assessment.questions.forEach(question => {
        const userAnswer = question.userAnswers.find(ua => ua.userId === userId);
        if (userAnswer) {
          const topic = question.topic || 'General';
          const subject = result.assessment.course.examType;
          
          if (!topicPerformance.has(topic)) {
            topicPerformance.set(topic, {
              correct: 0,
              total: 0,
              subject,
              lastPracticed: result.completedAt
            });
          }

          const performance = topicPerformance.get(topic)!;
          performance.total++;
          if (userAnswer.isCorrect) {
            performance.correct++;
          }
          performance.lastPracticed = new Date(Math.max(
            performance.lastPracticed.getTime(),
            result.completedAt.getTime()
          ));
        }
      });
    });

    // Find weak areas (accuracy < 70% and at least 3 questions attempted)
    const weakAreas = Array.from(topicPerformance.entries())
      .filter(([_, performance]) => {
        const accuracy = (performance.correct / performance.total) * 100;
        return accuracy < 70 && performance.total >= 3;
      })
      .map(([topic, performance]) => ({
        topic,
        subject: performance.subject,
        accuracy: Math.round((performance.correct / performance.total) * 100),
        questionsAttempted: performance.total,
        lastPracticed: performance.lastPracticed.toISOString()
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5); // Top 5 weak areas

    res.json({
      success: true,
      data: weakAreas
    });
  } catch (error) {
    next(error);
  }
});

// Get dashboard statistics
router.get("/dashboard-stats", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const [
      enrollments,
      assessmentResults,
      studySessions,
      userRanking
    ] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          progress: {
            select: {
              completedAt: true
            }
          },
          course: {
            select: {
              lessons: {
                select: { id: true }
              }
            }
          }
        }
      }),
      prisma.assessmentResult.findMany({
        where: { userId },
        select: {
          score: true,
          maxScore: true,
          completedAt: true
        }
      }),
      prisma.studySession.findMany({
        where: { 
          userId,
          endTime: { not: null }
        },
        select: {
          startTime: true,
          endTime: true
        }
      }),
      // Get user ranking
      prisma.$queryRaw`
        SELECT 
          COUNT(*) + 1 as rank,
          (SELECT COUNT(*) FROM users WHERE role = 'STUDENT') as totalStudents
        FROM users u
        LEFT JOIN assessment_results ar ON u.id = ar.userId
        WHERE u.role = 'STUDENT'
        GROUP BY u.id
        HAVING AVG(ar.score / ar.maxScore) > (
          SELECT AVG(score / maxScore) 
          FROM assessment_results 
          WHERE userId = ${userId}
        )
      `
    ]);

    // Calculate statistics
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(enrollment => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.progress.filter(p => p.completedAt).length;
      return totalLessons > 0 && completedLessons === totalLessons;
    }).length;

    const totalAssessments = assessmentResults.length;
    const averageScore = assessmentResults.length > 0 
      ? Math.round(assessmentResults.reduce((sum, result) => 
          sum + (result.score / result.maxScore) * 100, 0) / assessmentResults.length)
      : 0;

    // Calculate study time
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const studyTimeThisWeek = studySessions
      .filter(session => new Date(session.startTime) >= oneWeekAgo)
      .reduce((total, session) => {
        if (session.endTime) {
          return total + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime());
        }
        return total;
      }, 0) / (1000 * 60); // Convert to minutes

    const studyTimeTotal = studySessions.reduce((total, session) => {
      if (session.endTime) {
        return total + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime());
      }
      return total;
    }, 0) / (1000 * 60); // Convert to minutes

    // Get ranking info
    const ranking = userRanking as any[];
    const rank = ranking.length > 0 ? ranking[0].rank : 1;
    const totalStudents = ranking.length > 0 ? ranking[0].totalStudents : 1;

    res.json({
      success: true,
      data: {
        totalCourses,
        completedCourses,
        totalAssessments,
        averageScore,
        studyTimeThisWeek: Math.round(studyTimeThisWeek),
        studyTimeTotal: Math.round(studyTimeTotal),
        rank: parseInt(rank),
        totalStudents: parseInt(totalStudents)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get performance trend data
router.get("/performance-trend", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const assessmentResults = await prisma.assessmentResult.findMany({
      where: { userId },
      select: {
        score: true,
        maxScore: true,
        completedAt: true,
        assessment: {
          select: {
            title: true,
            course: {
              select: { examType: true }
            }
          }
        }
      },
      orderBy: { completedAt: 'asc' },
      take: 50 // Last 50 assessments
    });

    const performanceData = assessmentResults.map((result, index) => ({
      assessment: index + 1,
      score: Math.round((result.score / result.maxScore) * 100),
      date: result.completedAt.toISOString().split('T')[0],
      title: result.assessment.title,
      subject: result.assessment.course.examType
    }));

    res.json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    next(error);
  }
});

export default router;

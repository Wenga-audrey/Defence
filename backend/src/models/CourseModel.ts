import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateCourseData {
  title: string;
  description: string;
  thumbnail?: string;
  examType: string;
  level: string;
  duration: number;
  price?: number;
  isPublished?: boolean;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  thumbnail?: string;
  examType?: string;
  level?: string;
  duration?: number;
  price?: number;
  isPublished?: boolean;
}

export class CourseModel {
  static async findAll(filters?: {
    examType?: string;
    level?: string;
    isPublished?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.examType) where.examType = filters.examType;
    if (filters?.level) where.level = filters.level;
    if (filters?.isPublished !== undefined)
      where.isPublished = filters.isPublished;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    return await prisma.course.findMany({
      where,
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            isPublished: true,
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string, includeUnpublished = false) {
    const where: any = { id };
    if (!includeUnpublished) {
      where.isPublished = true;
    }

    return await prisma.course.findUnique({
      where,
      include: {
        lessons: {
          where: includeUnpublished ? {} : { isPublished: true },
          include: {
            assessments: {
              select: {
                id: true,
                title: true,
                type: true,
                timeLimit: true,
                passingScore: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        categories: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
  }

  static async create(courseData: CreateCourseData) {
    return await prisma.course.create({
      data: {
        ...courseData,
        isPublished: courseData.isPublished ?? false,
      },
      include: {
        lessons: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
    });
  }

  static async update(id: string, courseData: UpdateCourseData) {
    return await prisma.course.update({
      where: { id },
      data: courseData,
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.course.delete({
      where: { id },
    });
  }

  static async enroll(
    userId: string,
    courseId: string,
    opts?: { trial?: boolean; trialDays?: number },
  ) {
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }

    // Enforce max 2 active enrollments
    const activeCount = await prisma.enrollment.count({
      where: { userId, status: "ACTIVE" },
    });
    if (activeCount >= 2) {
      throw new Error("Max enrollments reached (2 active classes)");
    }

    const isTrial = !!opts?.trial;
    const trialEndsAt = isTrial
      ? new Date(Date.now() + (opts?.trialDays ?? 7) * 24 * 60 * 60 * 1000)
      : null;

    return await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: "ACTIVE",
        progress: 0,
        isTrial,
        trialEndsAt: trialEndsAt || undefined,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            examType: true,
            level: true,
          },
        },
      },
    });
  }

  static async getEnrollment(userId: string, courseId: string) {
    return await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }

  static async updateProgress(
    userId: string,
    courseId: string,
    progress: number,
  ) {
    return await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progress,
        lastAccessAt: new Date(),
        ...(progress >= 100 && {
          status: "COMPLETED",
          completedAt: new Date(),
        }),
      },
    });
  }

  static async getUserCourses(userId: string) {
    return await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: {
                id: true,
                title: true,
                duration: true,
                order: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });
  }

  static async getPopularCourses(limit = 10) {
    return await prisma.course.findMany({
      where: { isPublished: true },
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
      take: limit,
    });
  }

  static async getRecommendedCourses(userId: string, limit = 5) {
    // Get user's exam targets and current level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        examTargets: true,
        currentLevel: true,
        enrollments: {
          select: { courseId: true },
        },
      },
    });

    if (!user) return [];

    const enrolledCourseIds = user.enrollments.map((e) => e.courseId);
    const examTargets = user.examTargets ? JSON.parse(user.examTargets) : [];

    return await prisma.course.findMany({
      where: {
        isPublished: true,
        id: {
          notIn: enrolledCourseIds,
        },
        OR: [{ examType: { in: examTargets } }, { level: user.currentLevel }],
      },
      include: {
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      take: limit,
    });
  }
}

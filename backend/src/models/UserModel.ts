import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export class UserModel {
  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(userData: CreateUserData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    return await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: (userData.role as any) || "LEARNER",
        phone: userData.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }

  static async update(id: string, userData: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        avatar: userData.avatar,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  static async setEmailVerified(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
      },
    });
  }

  static async setResetToken(email: string, token: string) {
    return await prisma.user.update({
      where: { email },
      data: { resetToken: token },
    });
  }

  static async findByResetToken(token: string) {
    return await prisma.user.findFirst({
      where: { resetToken: token },
    });
  }

  static async clearResetToken(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { resetToken: null },
    });
  }

  static async getAnalytics(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            class: true,
          },
        },
        quizResults: {
          orderBy: { completedAt: "desc" },
          take: 10,
        },
        payments: true,
      },
    });

    if (!user) return null;

    // Calculate statistics
    const totalClasses = user.enrollments.length;
    const completedClasses = user.enrollments.filter(
      (e) => e.status === "COMPLETED",
    ).length;
    const averageScore =
      user.quizResults.length > 0
        ? Math.round(
            user.quizResults.reduce(
              (sum, result) => sum + result.score,
              0,
            ) / user.quizResults.length,
          )
        : 0;

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      stats: {
        totalClasses,
        completedClasses,
        averageScore,
        totalPayments: user.payments.length,
      },
      recentResults: user.quizResults,
      enrollments: user.enrollments,
    };
  }
}

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get user achievements
router.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const userAchievements = await (prisma as any).userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    });

    const allAchievements = await (prisma as any).achievement.findMany({
      orderBy: { points: 'desc' }
    });

    const achievedIds = userAchievements.map(ua => ua.achievementId);
    const availableAchievements = allAchievements.filter(a => !achievedIds.includes(a.id));

    res.json({
      success: true,
      data: {
        unlocked: userAchievements,
        available: availableAchievements,
        totalPoints: userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res, next) => {
  try {
    const topUsers = await (prisma as any).userAchievement.groupBy({
      by: ['userId'],
      _sum: {
        achievement: {
          points: true,
        },
      },
      orderBy: {
        _sum: {
          achievement: {
            points: 'desc',
          },
        },
      },
      take: 10,
    });

    const leaderboard = await Promise.all(
      topUsers.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: { id: true, firstName: true, lastName: true },
        });
        return {
          userId: entry.userId,
          name: `${user?.firstName} ${user?.lastName}`,
          totalPoints: entry._sum.achievement?.points || 0,
        };
      })
    );

  } catch (error) {
    next(error);
  }
});

export default router;

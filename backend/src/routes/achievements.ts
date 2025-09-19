import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get user achievements
router.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    });

    const allAchievements = await prisma.achievement.findMany({
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

// Get all achievements (for display)
router.get("/all", async (req, res, next) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { points: 'desc' }
    });

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
});

export default router;

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Get authenticated user's profile
router.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        paymentStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, data: { user, valid: true } });
  } catch (error) {
    next(error);
  }
});

// (Removed) Update learner level: not supported by current schema

// (Removed) Update preferred exams: not supported by current schema

// (Removed) Learner dashboard data: superseded by /api/learner/* endpoints

export default router;

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get user notifications
router.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;

    const where: any = { userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.patch("/:id/read", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const notification = await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true }
    });

    if (notification.count === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.patch("/read-all", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    next(error);
  }
});

// Create notification (internal use)
router.post("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { userId, title, message, type } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ error: "User ID, title, and message are required" });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type || 'info'
      }
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

export default router;

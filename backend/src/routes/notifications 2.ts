import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/api/notifications/:userId", async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.params.userId },
    orderBy: { timestamp: "desc" },
    take: 20,
  });
  res.json({ success: true, notifications });
});

export default router;
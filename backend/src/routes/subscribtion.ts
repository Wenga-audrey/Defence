import { Router } from "express";
import { prisma } from "../lib/prisma";
import { processPayment } from "../../services/payment";
import { AuthenticatedRequest } from "../types/request";

const router = Router();

// Process payment for preparatory class subscription
router.post("/prep-classes/:classId/pay", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;
    const classId = req.params.classId;
    const result = await processPayment({ userId, classId, amount, paymentMethod });
    if (result.success) {
      await prisma.payment.create({ data: { userId, classId, amount, status: "PAID" } });
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
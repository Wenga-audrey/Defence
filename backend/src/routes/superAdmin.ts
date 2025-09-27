import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// User management (create, update, suspend/ban)
router.post("/users", async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const user = await prisma.user.create({ data: { name, email, role } });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

router.patch("/users/:userId/suspend", async (req, res, next) => {
  try {
    await prisma.user.update({ where: { id: req.params.userId }, data: { suspended: true } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/users/:userId", async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.userId } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Platform configuration (languages, subscriptions, payments)
router.get("/settings", async (req, res, next) => {
  try {
    const settings = await prisma.platformSettings.findFirst();
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});
router.patch("/settings", async (req, res, next) => {
  try {
    await prisma.platformSettings.update({ where: { id: 1 }, data: req.body });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Content oversight
router.get("/pending-content", async (req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({ where: { approved: false } });
    const syllabi = await prisma.syllabus.findMany({ where: { approved: false } });
    res.json({ success: true, lessons, syllabi });
  } catch (err) {
    next(err);
  }
});
router.post("/lessons/:lessonId/approve", async (req, res, next) => {
  try {
    await prisma.lesson.update({ where: { id: req.params.lessonId }, data: { approved: true } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Analytics and reports
router.get("/dashboard", async (req, res, next) => {
  try {
    const userStats = await prisma.user.count();
    const paidUsers = await prisma.user.count({ where: { subscriptionStatus: "PAID" } });
    const revenue = await prisma.payment.aggregate({ _sum: { amount: true } });
    const exams = await prisma.exam.count();
    const courses = await prisma.course.count();
    const successRates = await prisma.analytics.findFirst();
    res.json({
      success: true,
      stats: {
        userStats,
        paidUsers,
        revenue: revenue._sum.amount,
        exams,
        courses,
        successRates,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Security & compliance
router.get("/audit-logs", async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
});

export default router;
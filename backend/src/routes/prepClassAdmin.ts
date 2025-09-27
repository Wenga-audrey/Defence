import { Router } from "express";
import { prisma } from "../lib/prisma";
import { sendNotificationToLearner } from "../utils/notifications";
import { AuthenticatedRequest } from "../types/request";

const router = Router();

// Create a new preparatory class (assign teacher, subjects, syllabus)
router.post("/prep-classes", async (req, res, next) => {
  try {
    const { name, teacherId, subjectIds, syllabus } = req.body;
    const prepClass = await prisma.prepClass.create({
      data: {
        name,
        teacherId,
        syllabus,
        subjects: { connect: subjectIds.map(id => ({ id })) },
      },
    });
    res.json({ success: true, prepClass });
  } catch (err) {
    next(err);
  }
});

// Assign syllabus file to a class & subject
router.post("/prep-classes/:classId/syllabus", async (req, res, next) => {
  try {
    const { syllabusUrl, subjectId } = req.body;
    await prisma.prepClassSubject.update({
      where: { classId_subjectId: { classId: req.params.classId, subjectId } },
      data: { syllabusUrl },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Validate student after payment
router.post("/prep-classes/:classId/validate-student", async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const prepClassId = req.params.classId;
    const payment = await prisma.payment.findFirst({ where: { userId: studentId, classId: prepClassId, status: "PAID" } });
    if (!payment) return res.status(400).json({ success: false, error: "Payment not found" });
    await prisma.enrollment.updateMany({
      where: { userId: studentId, classId: prepClassId },
      data: { status: "ACTIVE" },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Subscription/payment endpoint for learners
router.post("/prep-classes/:classId/pay", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user.id;
    const prepClassId = req.params.classId;
    // ... payment logic here ...
    await prisma.payment.create({ data: { userId, classId: prepClassId, status: "PAID" } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Notify learners when a new course is uploaded
router.post("/courses/:courseId/notify-learners", async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await prisma.course.findUnique({ where: { id: courseId }, include: { prepClass: true } });
    const learners = await prisma.enrollment.findMany({ where: { classId: course.prepClass.id, status: "ACTIVE" }, select: { userId: true } });
    for (const learner of learners) {
      await sendNotificationToLearner(learner.userId, `New course '${course.title}' is now available!`);
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Study Group for each class
router.get("/prep-classes/:classId/study-group", async (req, res, next) => {
  try {
    const prepClassId = req.params.classId;
    const group = await prisma.studyGroup.findFirst({ where: { classId: prepClassId }, include: { members: true, messages: true } });
    res.json({ success: true, group });
  } catch (err) {
    next(err);
  }
});

export default router;
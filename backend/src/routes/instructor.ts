import { Router } from "express";
import { prisma } from "../lib/prisma";
import multer from "multer";
const upload = multer({ dest: "uploads/pdfs/" });

const router = Router();

// Upload PDF for lesson or chapter
router.post("/lessons/:lessonId/upload-pdf", upload.single("pdf"), async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    const pdfPath = `/uploads/pdfs/${req.file.filename}`;
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { pdfUrl: pdfPath },
    });
    res.json({ success: true, pdfUrl: pdfPath });
  } catch (err) {
    next(err);
  }
});

// Assign quiz to class, subject, topic (manual or AI)
router.post("/quizzes/create", async (req, res, next) => {
  try {
    const { classId, subjectId, chapterId, title, questions, isAI } = req.body;
    const quiz = await prisma.quiz.create({
      data: {
        classId,
        subjectId,
        chapterId,
        title,
        questions,
        isAI,
      },
    });
    res.json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
});

// Track/view learner progress
router.get("/prep-classes/:classId/learner-progress", async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const learners = await prisma.enrollment.findMany({
      where: { classId, status: "ACTIVE" },
      include: {
        user: true,
        progress: true,
      },
    });
    res.json({ success: true, learners });
  } catch (err) {
    next(err);
  }
});
export default router;
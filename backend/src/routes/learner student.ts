import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// ...other routes...

// Get enrolled subject with chapters, lessons, quizzes, and PDFs for learner
router.get("/subjects/:subjectId", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subjectId = req.params.subjectId;

    // Find subject with chapters, lessons, quizzes for this learner
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        chapters: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                pdfUrl: true,
                isCompleted: true,
                order: true,
              },
            },
            quizzes: {
              select: {
                id: true,
                title: true,
                isCompleted: true,
                isAI: true,
                score: true,
                order: true,
              },
            },
          },
        },
        subjectQuizzes: {
          select: {
            id: true,
            title: true,
            isCompleted: true,
            isAI: true,
            score: true,
            order: true,
          },
        },
      },
    });

    if (!subject) return res.status(404).json({ success: false, error: "Subject not found" });

    // Optionally filter lessons/quizzes for only those available to this learner
    // e.g., based on enrollment, progress, etc.

    res.json({ success: true, data: subject });
  } catch (err) {
    next(err);
  }
});

export default router;
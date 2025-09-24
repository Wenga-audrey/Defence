import express from "express";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// GET /api/learner/context
// Returns active enrollment class (examType), subjects with chapter counts and progress for the learner
router.get("/context", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Find active enrollment with related class and subjects/chapters
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId, status: "ACTIVE" },
      include: {
        class: {
          include: {
            subjects: {
              include: {
                chapters: {
                  select: { id: true }
                }
              },
              orderBy: { order: "asc" }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return res.json({
        success: true,
        data: { activeClass: null, subjects: [] }
      });
    }

    // Compute per-subject progress using ChapterProgress
    const chapterIds = enrollment.class.subjects.flatMap(s => s.chapters.map(c => c.id));
    const progress = await prisma.chapterProgress.findMany({
      where: { userId, chapterId: { in: chapterIds } },
      select: { chapterId: true, isCompleted: true, timeSpent: true, updatedAt: true }
    });

    const subjects = enrollment.class.subjects.map(s => {
      const sChapterIds = s.chapters.map(c => c.id);
      const sProgress = progress.filter(p => sChapterIds.includes(p.chapterId));
      const totalChapters = sChapterIds.length;
      const completedChapters = sProgress.filter(p => p.isCompleted).length;
      const timeSpent = sProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
      const lastAccessed = sProgress.reduce<Date | null>((latest, p) => {
        const d = new Date(p.updatedAt);
        return !latest || d > latest ? d : latest;
      }, null);

      return {
        id: s.id,
        title: s.name,
        examType: enrollment.class.examType,
        totalLessons: totalChapters,
        completedLessons: completedChapters,
        progress: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
        lastAccessed: lastAccessed ? lastAccessed.toISOString() : enrollment.enrolledAt.toISOString(),
        thumbnail: null
      };
    });

    res.json({
      success: true,
      data: {
        activeClass: {
          id: enrollment.class.id,
          name: enrollment.class.name,
          examType: enrollment.class.examType,
          startDate: enrollment.class.startDate,
          endDate: enrollment.class.endDate,
        },
        subjects
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/learner/dashboard
// Returns KPIs: courses enrolled, completed, total assessments, average score, study time (this week & total), rank, totalStudents
router.get("/dashboard", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const [enrollments, quizResults, chapterProgress, totalStudents] = await Promise.all([
      prisma.enrollment.findMany({ where: { userId } }),
      prisma.quizResult.findMany({ where: { userId } }),
      prisma.chapterProgress.findMany({ where: { userId } }),
      prisma.user.count({ where: { role: "LEARNER" } })
    ]);

    const totalCourses = enrollments.length;
    const completedCourses = 0; // Optional: derive based on all chapters completed per class

    const totalAssessments = quizResults.length;
    const averageScore = totalAssessments > 0
      ? Math.round(quizResults.reduce((s, r) => s + ((r.score / r.maxScore) * 100), 0) / totalAssessments)
      : 0;

    // Study time
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const studyTimeTotal = Math.round(chapterProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0));
    const studyTimeThisWeek = Math.round(chapterProgress
      .filter(p => new Date(p.updatedAt) >= oneWeekAgo)
      .reduce((sum, p) => sum + (p.timeSpent || 0), 0));

    // Rank placeholder: 1 for now (can be improved with average score comparison)
    const rank = 1;

    res.json({
      success: true,
      data: {
        totalCourses,
        completedCourses,
        totalAssessments,
        averageScore,
        studyTimeThisWeek,
        studyTimeTotal,
        rank,
        totalStudents
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/learner/recent-quiz-results
router.get("/recent-quiz-results", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const results = await prisma.quizResult.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 10,
      include: {
        chapterQuiz: { select: { title: true } },
        subjectQuiz: { select: { title: true } }
      }
    });

    const mapped = results.map(r => ({
      id: r.id,
      title: r.chapterQuiz?.title || r.subjectQuiz?.title || "Quiz",
      score: r.score,
      maxScore: r.maxScore,
      completedAt: r.completedAt,
      difficulty: undefined,
      subject: undefined
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
});

export default router;

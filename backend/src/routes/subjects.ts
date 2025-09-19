import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get subjects for a class
router.get('/class/:classId', async (req, res, next) => {
  try {
    const { classId } = req.params;

    const subjects = await prisma.subject.findMany({
      where: {
        classId,
        isActive: true
      },
      include: {
        chapters: {
          where: { isPublished: true },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' }
            },
            quizzes: {
              where: { isActive: true }
            },
            _count: {
              select: {
                lessons: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        quizzes: {
          where: { isActive: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(subjects);
  } catch (error) {
    next(error);
  }
});

// Get single subject with detailed content
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        class: true,
        chapters: {
          where: { isPublished: true },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' }
            },
            quizzes: {
              where: { isActive: true },
              include: {
                _count: {
                  select: {
                    questions: true
                  }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        quizzes: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                questions: true
              }
            }
          }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    next(error);
  }
});

// Create subject (Prep Admin only)
router.post('/', authenticate, requireRole(['PREP_ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { classId, name, description, order } = req.body;

    const subject = await prisma.subject.create({
      data: {
        classId,
        name,
        description,
        order: parseInt(order),
        isActive: true
      }
    });

    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
});

// Update subject
router.put('/:id', authenticate, requireRole(['PREP_ADMIN', 'TEACHER', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, order, isActive } = req.body;

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        description,
        order: order ? parseInt(order) : undefined,
        isActive
      }
    });

    res.json(subject);
  } catch (error) {
    next(error);
  }
});

// Get subject progress for a learner
router.get('/:id/progress', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        chapters: {
          where: { isPublished: true },
          include: {
            progress: {
              where: { userId }
            },
            lessons: {
              where: { isPublished: true }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Calculate progress statistics
    const totalChapters = subject.chapters.length;
    const completedChapters = subject.chapters.filter(chapter => 
      chapter.progress.length > 0 && chapter.progress[0].isCompleted
    ).length;

    const totalLessons = subject.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
    const totalTimeSpent = subject.chapters.reduce((sum, chapter) => 
      sum + (chapter.progress[0]?.timeSpent || 0), 0
    );

    const progressData = {
      subject,
      stats: {
        totalChapters,
        completedChapters,
        totalLessons,
        totalTimeSpent,
        progressPercentage: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
      }
    };

    res.json(progressData);
  } catch (error) {
    next(error);
  }
});

export default router;

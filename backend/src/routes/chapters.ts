import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get chapter with lessons and progress
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            class: true
          }
        },
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
        },
        progress: {
          where: { userId }
        }
      }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    next(error);
  }
});

// Create chapter (Teachers and Prep Admin)
router.post('/', authenticate, requireRole(['PREP_ADMIN', 'TEACHER', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { subjectId, title, description, order, duration } = req.body;

    const chapter = await prisma.chapter.create({
      data: {
        subjectId,
        title,
        description,
        order: parseInt(order),
        duration: parseInt(duration),
        isPublished: false
      }
    });

    res.status(201).json(chapter);
  } catch (error) {
    next(error);
  }
});

// Update chapter
router.put('/:id', authenticate, requireRole(['PREP_ADMIN', 'TEACHER', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, order, duration, isPublished } = req.body;

    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        title,
        description,
        order: order ? parseInt(order) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        isPublished
      }
    });

    res.json(chapter);
  } catch (error) {
    next(error);
  }
});

// Mark chapter as completed
router.post('/:id/complete', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { timeSpent } = req.body;

    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    // Update or create progress
    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: id
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        timeSpent: parseInt(timeSpent) || 0
      },
      create: {
        userId,
        chapterId: id,
        isCompleted: true,
        completedAt: new Date(),
        timeSpent: parseInt(timeSpent) || 0
      }
    });

    res.json(progress);
  } catch (error) {
    next(error);
  }
});

// Get chapter progress for all learners (Teachers and Prep Admin)
router.get('/:id/progress', authenticate, requireRole(['PREP_ADMIN', 'TEACHER', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const progressData = await prisma.chapterProgress.findMany({
      where: { chapterId: id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    res.json(progressData);
  } catch (error) {
    next(error);
  }
});

export default router;

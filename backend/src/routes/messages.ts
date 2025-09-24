import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to check if two users share any preparatory class (either both enrolled or one is a teacher of the class)
async function usersShareClass(prisma: PrismaClient, a: string, b: string): Promise<boolean> {
  // Check enrollments
  const aEnrollments = await prisma.enrollment.findMany({ where: { userId: a }, select: { classId: true } });
  const bEnrollments = await prisma.enrollment.findMany({ where: { userId: b }, select: { classId: true } });
  const aClasses = new Set(aEnrollments.map(e => e.classId));
  const sharedByEnrollment = bEnrollments.some(e => aClasses.has(e.classId));
  if (sharedByEnrollment) return true;

  // Check teacher assignments
  const aTeaching = await prisma.classTeacher.findMany({ where: { teacherId: a }, select: { classId: true } });
  const bTeaching = await prisma.classTeacher.findMany({ where: { teacherId: b }, select: { classId: true } });
  const aTeachClasses = new Set(aTeaching.map(t => t.classId));
  const bTeachClasses = new Set(bTeaching.map(t => t.classId));
  const sharedTeaching = [...aTeachClasses].some(id => bTeachClasses.has(id));
  if (sharedTeaching) return true;

  // Check teacher-to-learner in same class
  const bEnrollClassSet = new Set(bEnrollments.map(e => e.classId));
  const teacherToLearner = aTeaching.some(t => bEnrollClassSet.has(t.classId));
  if (teacherToLearner) return true;

  const aEnrollClassSet = new Set(aEnrollments.map(e => e.classId));
  const learnerToTeacher = bTeaching.some(t => aEnrollClassSet.has(t.classId));
  return learnerToTeacher;
}

// Send a message
router.post('/send', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const senderId = req.user!.id;
    const { recipientId, content } = req.body as { recipientId: string; content: string };

    if (!recipientId || !content) {
      return res.status(400).json({ error: 'recipientId and content are required' });
    }

    const allowed = await usersShareClass(prisma, senderId, recipientId);
    if (!allowed) {
      return res.status(403).json({ error: 'You can only message users within your classes' });
    }

    const msg = await prisma.privateMessage.create({
      data: { senderId, recipientId, content }
    });

    // Notify recipient
    try {
      await (prisma as any).notification.create({
        data: {
          userId: recipientId,
          title: 'New Message',
          message: 'You have a new message from your class contact.',
          type: 'message'
        }
      });
    } catch {}

    res.status(201).json(msg);
  } catch (error) {
    next(error);
  }
});

// List conversation between current user and target user
router.get('/with/:userId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const me = req.user!.id;
    const other = req.params.userId;

    const allowed = await usersShareClass(prisma, me, other);
    if (!allowed) {
      return res.status(403).json({ error: 'You can only view messages with users in your classes' });
    }

    const messages = await prisma.privateMessage.findMany({
      where: {
        OR: [
          { senderId: me, recipientId: other },
          { senderId: other, recipientId: me }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
});

export default router;

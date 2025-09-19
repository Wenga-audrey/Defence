import express from 'express';
import { LiveSessionService } from '../lib/liveSessionService';
import { authenticate, requireRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create live session (Teachers only)
router.post('/', 
  authenticate, 
  requireRole(['TEACHER', 'PREP_ADMIN']), 
  async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { title, description, classId, subjectId, scheduledAt, duration, maxParticipants } = req.body;

      if (!title || !classId || !scheduledAt || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const session = await LiveSessionService.createSession({
        title,
        description,
        teacherId: userId,
        classId,
        subjectId,
        scheduledAt: new Date(scheduledAt),
        duration: parseInt(duration),
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined
      });

      res.status(201).json({
        message: 'Live session created successfully',
        session
      });

    } catch (error) {
      console.error('Error creating live session:', error);
      res.status(500).json({ error: 'Failed to create live session' });
    }
  }
);

// Get sessions by teacher
router.get('/teacher/:teacherId',
  authenticate,
  async (req, res) => {
    try {
      const { teacherId } = req.params;
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;

      // Only allow teachers to view their own sessions or admins to view any
      if (userId !== teacherId && !['PREP_ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const sessions = await LiveSessionService.getSessionsByTeacher(teacherId);

      res.json({ sessions });

    } catch (error) {
      console.error('Error fetching teacher sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }
);

// Get sessions by class
router.get('/class/:classId',
  authenticate,
  async (req, res) => {
    try {
      const { classId } = req.params;
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;

      // Verify user has access to this class
      if (userRole === 'LEARNER') {
        const enrollment = await prisma.enrollment.findFirst({
          where: { userId, classId, status: 'ACTIVE' }
        });
        if (!enrollment) {
          return res.status(403).json({ error: 'Not enrolled in this class' });
        }
      } else if (userRole === 'TEACHER') {
        const teacherAssignment = await prisma.classTeacher.findFirst({
          where: { teacherId: userId, classId }
        });
        if (!teacherAssignment) {
          return res.status(403).json({ error: 'Not assigned to this class' });
        }
      }

      const sessions = await LiveSessionService.getSessionsByClass(classId);

      res.json({ sessions });

    } catch (error) {
      console.error('Error fetching class sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }
);

// Join live session
router.post('/:sessionId/join',
  authenticate,
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const userId = (req as any).user.id;

      const result = await LiveSessionService.joinSession(sessionId, userId);

      res.json({
        message: 'Joined session successfully',
        meetingUrl: result.meetingUrl,
        sessionId: result.sessionId
      });

    } catch (error) {
      console.error('Error joining session:', error);
      res.status(500).json({ error: error.message || 'Failed to join session' });
    }
  }
);

// Update session status
router.patch('/:sessionId/status',
  authenticate,
  requireRole(['TEACHER', 'PREP_ADMIN']),
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { status } = req.body;
      const userId = (req as any).user.id;

      if (!['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      // Verify teacher owns this session or is prep admin
      const userRole = (req as any).user.role;
      if (userRole !== 'PREP_ADMIN') {
        const session = await prisma.$queryRaw`
          SELECT * FROM live_sessions WHERE id = ${sessionId} AND teacher_id = ${userId}
        ` as any[];
        
        if (!session.length) {
          return res.status(403).json({ error: 'Access denied to this session' });
        }
      }

      await LiveSessionService.updateSessionStatus(sessionId, status);

      res.json({ message: 'Session status updated successfully' });

    } catch (error) {
      console.error('Error updating session status:', error);
      res.status(500).json({ error: 'Failed to update session status' });
    }
  }
);

// Record attendance
router.post('/:sessionId/attendance',
  authenticate,
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { duration } = req.body;
      const userId = (req as any).user.id;

      if (!duration || duration < 0) {
        return res.status(400).json({ error: 'Invalid duration' });
      }

      await LiveSessionService.recordAttendance(sessionId, userId, parseInt(duration));

      res.json({ message: 'Attendance recorded successfully' });

    } catch (error) {
      console.error('Error recording attendance:', error);
      res.status(500).json({ error: 'Failed to record attendance' });
    }
  }
);

export default router;

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all preparatory classes
router.get('/', async (req, res, next) => {
  try {
    const classes = await prisma.preparatoryClass.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          include: {
            chapters: {
              where: { isPublished: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(classes);
  } catch (error) {
    next(error);
  }
});

// Get single preparatory class
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const prepClass = await prisma.preparatoryClass.findUnique({
      where: { id },
      include: {
        subjects: {
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
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        announcements: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!prepClass) {
      return res.status(404).json({ error: 'Preparatory class not found' });
    }

    res.json(prepClass);
  } catch (error) {
    next(error);
  }
});

// Create preparatory class (Prep Admin only)
router.post('/', authenticate, requireRole(['PREP_ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const {
      name,
      description,
      examType,
      startDate,
      endDate,
      price,
      maxStudents
    } = req.body;

    const prepClass = await prisma.preparatoryClass.create({
      data: {
        name,
        description,
        examType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: parseFloat(price),
        maxStudents: parseInt(maxStudents),
        isActive: true
      }
    });

    res.status(201).json(prepClass);
  } catch (error) {
    next(error);
  }
});

// Update preparatory class
router.put('/:id', authenticate, requireRole(['PREP_ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      examType,
      startDate,
      endDate,
      price,
      maxStudents,
      isActive
    } = req.body;

    const prepClass = await prisma.preparatoryClass.update({
      where: { id },
      data: {
        name,
        description,
        examType,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        price: price ? parseFloat(price) : undefined,
        maxStudents: maxStudents ? parseInt(maxStudents) : undefined,
        isActive
      }
    });

    res.json(prepClass);
  } catch (error) {
    next(error);
  }
});

// Enroll in preparatory class
router.post('/:id/enroll', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if class exists and is active
    const prepClass = await prisma.preparatoryClass.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!prepClass || !prepClass.isActive) {
      return res.status(404).json({ error: 'Preparatory class not found or inactive' });
    }

    // Check if class is full
    if (prepClass._count.enrollments >= prepClass.maxStudents) {
      return res.status(400).json({ error: 'Class is full' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId,
          classId: id
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this class' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        classId: id,
        status: 'ACTIVE'
      },
      include: {
        class: true
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
});

// Get class enrollments (Prep Admin and Teachers only)
router.get('/:id/enrollments', authenticate, requireRole(['PREP_ADMIN', 'TEACHER', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { classId: id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            paymentStatus: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
});

// Assign teacher to class
router.post('/:id/teachers', authenticate, requireRole(['PREP_ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { teacherId, subjectId, role = 'TEACHER' } = req.body;

    // Verify teacher exists and has correct role
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId }
    });

    if (!teacher || teacher.role !== 'TEACHER') {
      return res.status(400).json({ error: 'Invalid teacher' });
    }

    const assignment = await prisma.classTeacher.create({
      data: {
        classId: id,
        teacherId,
        subjectId,
        role
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
});

// Bulk setup: create subjects/chapters and assign teachers in one request
router.post('/:id/setup-bulk', authenticate, requireRole(['PREP_ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params; // classId
    const { subjects = [], teacherAssignments = [] } = req.body as {
      subjects: Array<{ name: string; description?: string; order: number; chapters?: Array<{ title: string; description?: string; order: number; duration?: number }> }>;
      teacherAssignments: Array<{ teacherId: string; subjectName?: string; subjectId?: string; role?: string }>;
    };

    // Ensure class exists
    const cls = await prisma.preparatoryClass.findUnique({ where: { id } });
    if (!cls) return res.status(404).json({ error: 'Preparatory class not found' });

    // Create subjects (and chapters)
    const createdSubjects = [] as { id: string; name: string }[];
    for (const s of subjects) {
      const subj = await prisma.subject.create({
        data: {
          classId: id,
          name: s.name,
          description: s.description,
          order: s.order,
          isActive: true,
          chapters: s.chapters && s.chapters.length ? {
            create: s.chapters.map(ch => ({
              title: ch.title,
              description: ch.description,
              order: ch.order,
              duration: ch.duration ?? 60,
              isPublished: false
            }))
          } : undefined
        }
      });
      createdSubjects.push({ id: subj.id, name: subj.name });
    }

    // Map subjectName to subjectId when needed
    const nameToId = new Map(createdSubjects.map(s => [s.name, s.id]));

    // Assign teachers
    const createdAssignments = [] as any[];
    for (const t of teacherAssignments) {
      const subjectId = t.subjectId || (t.subjectName ? nameToId.get(t.subjectName) : undefined) || null;
      const assignment = await prisma.classTeacher.create({
        data: {
          classId: id,
          teacherId: t.teacherId,
          subjectId: subjectId || undefined,
          role: t.role || 'TEACHER'
        }
      });
      createdAssignments.push(assignment);
    }

    res.status(201).json({
      success: true,
      createdSubjects,
      createdAssignments
    });
  } catch (error) {
    next(error);
  }
});

export default router;

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get payment methods available
router.get('/methods', async (req, res, next) => {
  try {
    const methods = [
      {
        id: 'ORANGE_MONEY',
        name: 'Orange Money',
        description: 'Paiement via Orange Money',
        icon: '🟠',
        isActive: true
      },
      {
        id: 'MTN_MOMO',
        name: 'MTN Mobile Money',
        description: 'Paiement via MTN MoMo',
        icon: '🟡',
        isActive: true
      },
      {
        id: 'BANK_TRANSFER',
        name: 'Virement Bancaire',
        description: 'Virement bancaire direct',
        icon: '🏦',
        isActive: true
      },
      {
        id: 'CASH',
        name: 'Espèces',
        description: 'Paiement en espèces (bureau)',
        icon: '💵',
        isActive: false
      }
    ];

    res.json(methods);
  } catch (error) {
    next(error);
  }
});

// Initiate payment for class enrollment
router.post('/initiate', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { classId, method, phoneNumber } = req.body;

    if (!classId || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get class details and price
    const preparatoryClass = await prisma.preparatoryClass.findUnique({
      where: { id: classId },
      select: { id: true, name: true, price: true, isActive: true }
    });

    if (!preparatoryClass || !preparatoryClass.isActive) {
      return res.status(404).json({ error: 'Class not found or inactive' });
    }

    // Check if user already has a pending/paid payment for this class
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        classId,
        status: { in: ['PENDING', 'PAID'] }
      }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        error: 'Payment already exists for this class',
        payment: existingPayment
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        classId,
        amount: preparatoryClass.price,
        method: method as any,
        phoneNumber: phoneNumber || null,
        transactionId: generateTransactionId(),
        status: 'PENDING'
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        class: { select: { name: true, examType: true } }
      }
    });

    // Here you would integrate with actual payment providers
    const paymentResponse = await initiateExternalPayment(payment);

    res.status(201).json({
      message: 'Payment initiated successfully',
      payment,
      paymentUrl: paymentResponse.paymentUrl,
      transactionId: payment.transactionId
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Prep Admin: Validate payment
router.patch('/:paymentId/validate',
  authenticate,
  requireRole(['PREP_ADMIN', 'SUPER_ADMIN']),
  async (req: AuthRequest, res, next) => {
    try {
      const { paymentId } = req.params;
      const { status, validationNotes } = req.body;
      const adminId = req.user!.id;

      if (!['PAID', 'REFUNDED', 'EXPIRED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }

      // Get payment details
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          class: { select: { id: true, name: true, examType: true } }
        }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: status as any,
          paidAt: status === 'PAID' ? new Date() : null,
          updatedAt: new Date()
        }
      });

      // If payment is validated as PAID, automatically activate enrollment
      if (status === 'PAID') {
        await activateEnrollmentAfterPayment(payment.userId, payment.classId);
        
        // Update user payment status
        await prisma.user.update({
          where: { id: payment.userId },
          data: { paymentStatus: 'PAID' }
        });
      }

      // Log validation action
      await prisma.announcement.create({
        data: {
          classId: payment.classId,
          authorId: adminId,
          title: `Payment ${status === 'PAID' ? 'Validated' : 'Updated'}`,
          content: `Payment for ${payment.user.firstName} ${payment.user.lastName} has been ${status.toLowerCase()}. ${validationNotes || ''}`,
          isUrgent: false
        }
      });

      res.json({
        message: `Payment ${status.toLowerCase()} successfully`,
        payment: updatedPayment,
        enrollmentActivated: status === 'PAID'
      });

    } catch (error) {
      console.error('Payment validation error:', error);
      res.status(500).json({ error: 'Failed to validate payment' });
    }
  }
);

// Get pending payments for prep admin validation
router.get('/pending',
  authenticate,
  requireRole(['PREP_ADMIN', 'SUPER_ADMIN']),
  async (req: AuthRequest, res, next) => {
    try {
      const userRole = req.user!.role;
      const adminId = req.user!.id;

      let whereClause: any = { status: 'PENDING' };

      // If prep admin, only show payments for their managed classes
      if (userRole === 'PREP_ADMIN') {
        const managedClasses = await prisma.classTeacher.findMany({
          where: { teacherId: adminId },
          select: { classId: true }
        });
        
        const classIds = managedClasses.map(ct => ct.classId);
        whereClause.classId = { in: classIds };
      }

      const pendingPayments = await prisma.payment.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          class: {
            select: {
              id: true,
              name: true,
              examType: true,
              price: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        payments: pendingPayments,
        total: pendingPayments.length
      });

    } catch (error) {
      console.error('Error fetching pending payments:', error);
      res.status(500).json({ error: 'Failed to fetch pending payments' });
    }
  }
);

// Get payment by ID
router.get('/:paymentId',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { paymentId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          class: { select: { name: true, examType: true, price: true } }
        }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Check access permissions
      if (userRole === 'LEARNER' && payment.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ payment });

    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  }
);

// Get payment instructions
router.get('/:paymentId/instructions',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { paymentId } = req.params;
      const userId = req.user!.id;

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        select: {
          id: true,
          userId: true,
          method: true,
          amount: true,
          transactionId: true,
          phoneNumber: true,
          status: true
        }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (payment.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const instructions = getPaymentInstructions(
        payment.method,
        Number(payment.amount),
        payment.transactionId,
        String(payment.phoneNumber ?? '')
      );

      res.json({
        payment: {
          id: payment.id,
          method: payment.method,
          amount: payment.amount,
          transactionId: payment.transactionId,
          status: payment.status
        },
        instructions
      });

    } catch (error) {
      console.error('Error fetching payment instructions:', error);
      res.status(500).json({ error: 'Failed to fetch payment instructions' });
    }
  }
);

// Webhook endpoint for payment provider callbacks
router.post('/webhook/:provider',
  async (req, res) => {
    try {
      const { provider } = req.params;
      const { transactionId, status, amount, reference } = req.body;

      if (!transactionId || !status) {
        return res.status(400).json({ error: 'Missing required webhook data' });
      }

      // Find payment by transaction ID
      const payment = await prisma.payment.findFirst({
        where: { transactionId }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Update payment based on webhook status
      let newStatus: any = 'PENDING';
      if (status === 'success' || status === 'completed') {
        newStatus = 'PAID';
      } else if (status === 'failed' || status === 'cancelled') {
        newStatus = 'EXPIRED';
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          paidAt: newStatus === 'PAID' ? new Date() : null
        }
      });

      // Auto-activate enrollment if payment successful
      if (newStatus === 'PAID') {
        await activateEnrollmentAfterPayment(payment.userId, payment.classId);
        
        await prisma.user.update({
          where: { id: payment.userId },
          data: { paymentStatus: 'PAID' }
        });
      }

      res.json({ message: 'Webhook processed successfully', payment: updatedPayment });

    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  }
);

// Auto-enrollment activation function
async function activateEnrollmentAfterPayment(userId: string, classId: string) {
  try {
    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId, classId }
    });

    if (existingEnrollment) {
      // Update existing enrollment to ACTIVE
      await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: { 
          status: 'ACTIVE',
          enrolledAt: new Date()
        }
      });
    } else {
      // Create new enrollment
      await prisma.enrollment.create({
        data: {
          userId,
          classId,
          status: 'ACTIVE',
          enrolledAt: new Date()
        }
      });
    }

    // Send welcome notification
    const classInfo = await prisma.preparatoryClass.findUnique({
      where: { id: classId },
      select: { name: true, examType: true }
    });

    await prisma.announcement.create({
      data: {
        classId,
        authorId: 'system', // System-generated announcement
        title: 'Bienvenue dans votre classe!',
        content: `Félicitations! Votre inscription à ${classInfo?.name} (${classInfo?.examType}) a été activée. Vous pouvez maintenant accéder à tous les cours et ressources.`,
        isUrgent: false
      }
    });

    return true;
  } catch (error) {
    console.error('Error activating enrollment:', error);
    throw error;
  }
}

// Generate unique transaction ID
function generateTransactionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return `TXN_${timestamp}_${random}`.toUpperCase();
}

// Simulate external payment provider integration
async function initiateExternalPayment(payment: any) {
  // This would integrate with Orange Money, MTN MoMo APIs
  // For now, return a mock response
  return {
    paymentUrl: `https://payment.provider.com/pay/${payment.transactionId}`,
    reference: payment.transactionId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  };
}

// Helper function to generate payment instructions
function getPaymentInstructions(method: string, amount: number, reference: string, phoneNumber?: string) {
  const instructions = {
    ORANGE_MONEY: {
      title: 'Instructions Orange Money',
      steps: [
        'Composez #150# sur votre téléphone Orange',
        'Sélectionnez "Payer un marchand"',
        `Entrez le code marchand: MINDBOOST`,
        `Montant: ${amount} FCFA`,
        `Référence: ${reference}`,
        'Confirmez avec votre code PIN',
        'Conservez le SMS de confirmation'
      ],
      note: 'Le paiement sera confirmé automatiquement dans quelques minutes.'
    },
    MTN_MOMO: {
      title: 'Instructions MTN Mobile Money',
      steps: [
        'Composez *126# sur votre téléphone MTN',
        'Sélectionnez "Payer"',
        'Sélectionnez "Payer un marchand"',
        `Code marchand: MINDBOOST`,
        `Montant: ${amount} FCFA`,
        `Référence: ${reference}`,
        'Confirmez avec votre code PIN',
        'Conservez le SMS de confirmation'
      ],
      note: 'Le paiement sera confirmé automatiquement dans quelques minutes.'
    },
    BANK_TRANSFER: {
      title: 'Instructions Virement Bancaire',
      steps: [
        'Effectuez un virement vers:',
        'Banque: Afriland First Bank',
        'Compte: 40001 00123 45678901234 56',
        'Bénéficiaire: MINDBOOST SARL',
        `Montant: ${amount} FCFA`,
        `Référence obligatoire: ${reference}`,
        'Envoyez le reçu par email à payments@mindboost.cm'
      ],
      note: 'La validation peut prendre 24-48h ouvrables.'
    }
  };

  return instructions[method as keyof typeof instructions] || {
    title: 'Instructions de paiement',
    steps: ['Contactez notre support pour les instructions de paiement'],
    note: 'Support: +237 6XX XXX XXX'
  };
}

// Create subscription
router.post('/subscriptions', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { planType, paymentMethod } = req.body;
    const userId = req.user!.id;

    const subscription = await (prisma as any).subscription.create({
      data: {
        userId,
        planType,
        paymentMethod,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
});

// Get user subscriptions
router.get('/subscriptions', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const subscriptions = await (prisma as any).subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
});

// Pay for a specific course
router.post('/courses/:courseId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { courseId } = req.params;
    const { paymentMethod } = req.body;
    const userId = req.user!.id;

    const course = await (prisma as any).course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const payment = await (prisma as any).payment.create({
      data: {
        userId,
        classId: course.classId, // Assuming course has a classId
        amount: Number(course.price),
        method: paymentMethod,
        status: 'PAID',
        transactionId: `PAY-${Date.now()}`,
      },
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
});

// Get institutional licensing options
router.get('/institutional', async (req, res, next) => {
  try {
    const plans = [
      {
        id: 'BASIC_INSTITUTIONAL',
        name: 'Basic Institutional',
        description: 'Up to 50 students',
        price: 500000,
        features: ['Up to 50 students', 'Basic support', 'Standard courses'],
      },
      {
        id: 'PREMIUM_INSTITUTIONAL',
        name: 'Premium Institutional',
        description: 'Up to 200 students',
        price: 1500000,
        features: ['Up to 200 students', 'Premium support', 'All courses', 'Custom content'],
      },
    ];

    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

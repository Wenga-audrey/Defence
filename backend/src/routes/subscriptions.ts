import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// Validation schemas
const createSubscriptionSchema = z.object({
  body: z.object({
    planType: z.enum(["FREE", "MONTHLY", "ANNUAL", "LIFETIME"]),
    stripeId: z.string().optional(),
  }),
});

// Get user's current subscription
router.get("/current", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      orderBy: { endDate: "desc" },
    });

    if (!subscription) {
      return res.json({
        subscription: null,
        hasActiveSubscription: false,
        planType: "FREE",
      });
    }

    const isExpired = subscription.endDate < new Date();
    if (isExpired) {
      // Update subscription status if expired
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });

      return res.json({
        subscription: null,
        hasActiveSubscription: false,
        planType: "FREE",
      });
    }

    res.json({
      subscription,
      hasActiveSubscription: true,
      planType: subscription.planType,
      daysRemaining: Math.ceil(
        (subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      ),
    });
  } catch (error) {
    next(error);
  }
});

// Get subscription history
router.get("/history", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = "1", limit = "10" } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.subscription.count({ where: { userId } }),
    ]);

    res.json({
      subscriptions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create subscription
router.post(
  "/",
  authenticate,
  validate(createSubscriptionSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { planType, stripeId } = req.body;
      const userId = req.user!.id;

      // Check if user already has an active subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      if (existingSubscription && existingSubscription.endDate > new Date()) {
        return res
          .status(409)
          .json({ error: "User already has an active subscription" });
      }

      // Calculate end date based on plan type
      let endDate = new Date();
      switch (planType) {
        case "MONTHLY":
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case "ANNUAL":
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
        case "LIFETIME":
          endDate.setFullYear(endDate.getFullYear() + 100); // Far future date
          break;
        case "FREE":
          endDate.setDate(endDate.getDate() + 7); // 7-day free trial
          break;
      }

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          planType,
          status: "ACTIVE",
          startDate: new Date(),
          endDate,
          stripeId,
        },
      });

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId,
          title: "Welcome to Mindboost!",
          message: `Your ${planType.toLowerCase()} subscription is now active. Start learning today!`,
          type: "SYSTEM",
        },
      });

      res.status(201).json({
        message: "Subscription created successfully",
        subscription,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Cancel subscription
router.put("/cancel", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (!subscription) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELLED" },
    });

    // Create cancellation notification
    await prisma.notification.create({
      data: {
        userId,
        title: "Subscription Cancelled",
        message:
          "Your subscription has been cancelled. You can continue using Mindboost until your current billing period ends.",
        type: "SYSTEM",
      },
    });

    res.json({
      message: "Subscription cancelled successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
});

// Reactivate subscription
router.put("/reactivate", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "CANCELLED",
      },
      orderBy: { endDate: "desc" },
    });

    if (!subscription) {
      return res.status(404).json({ error: "No cancelled subscription found" });
    }

    // Check if subscription is still within the billing period
    if (subscription.endDate < new Date()) {
      return res
        .status(400)
        .json({
          error:
            "Subscription period has expired. Please create a new subscription.",
        });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "ACTIVE" },
    });

    res.json({
      message: "Subscription reactivated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
});

// Get subscription plans and pricing
router.get("/plans", async (req, res) => {
  const plans = [
    {
      id: "free",
      name: "Free Trial",
      planType: "FREE",
      price: 0,
      duration: "7 days",
      features: [
        "Access to 2 courses",
        "Basic assessments",
        "Limited study tracking",
        "Community support",
      ],
      limitations: [
        "Limited course access",
        "No AI recommendations",
        "No progress analytics",
      ],
    },
    {
      id: "monthly",
      name: "Monthly Plan",
      planType: "MONTHLY",
      price: 9.99,
      duration: "1 month",
      features: [
        "Unlimited course access",
        "AI-powered assessments",
        "Personalized learning paths",
        "Progress analytics",
        "Study reminders",
        "Priority support",
      ],
      popular: false,
    },
    {
      id: "annual",
      name: "Annual Plan",
      planType: "ANNUAL",
      price: 99.99,
      duration: "12 months",
      originalPrice: 119.88,
      savings: "17% off",
      features: [
        "Everything in Monthly Plan",
        "Advanced AI recommendations",
        "Detailed performance analytics",
        "Offline content access",
        "Premium support",
        "Early access to new features",
      ],
      popular: true,
    },
    {
      id: "lifetime",
      name: "Lifetime Access",
      planType: "LIFETIME",
      price: 299.99,
      duration: "Lifetime",
      features: [
        "Everything in Annual Plan",
        "Lifetime updates",
        "VIP support",
        "Exclusive content",
        "Beta feature access",
        "Personal learning consultant",
      ],
      popular: false,
    },
  ];

  res.json({ plans });
});

// Admin: Get all subscriptions (admin only)
router.get(
  "/admin/all",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const { page = "1", limit = "20", status, planType } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = {};
      if (status) where.status = status;
      if (planType) where.planType = planType;

      const [subscriptions, total] = await Promise.all([
        prisma.subscription.findMany({
          where,
          skip,
          take,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.subscription.count({ where }),
      ]);

      res.json({
        subscriptions,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Admin: Update subscription (admin only)
router.put(
  "/admin/:subscriptionId",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const { subscriptionId } = req.params;
      const { status, endDate, planType } = req.body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (endDate) updateData.endDate = new Date(endDate);
      if (planType) updateData.planType = planType;

      const subscription = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.json({
        message: "Subscription updated successfully",
        subscription,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Webhook endpoint for Stripe (if using Stripe)
router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      // This is a placeholder for Stripe webhook handling
      // In production, you would verify the webhook signature and handle events

      const event = req.body;

      switch (event.type) {
        case "invoice.payment_succeeded":
          // Handle successful payment
          console.log("Payment succeeded:", event.data.object);
          break;
        case "invoice.payment_failed":
          // Handle failed payment
          console.log("Payment failed:", event.data.object);
          break;
        case "customer.subscription.deleted":
          // Handle subscription cancellation
          console.log("Subscription cancelled:", event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).send("Webhook error");
    }
  },
);

export default router;

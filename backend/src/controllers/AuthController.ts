import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { BaseController, AuthRequest } from "./BaseController";
import { UserModel } from "../models/UserModel";
import { generateToken } from "../lib/jwt.js";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  role: z.enum(["LEARNER", "TEACHER", "PREP_ADMIN", "SUPER_ADMIN"]).optional(),
  currentLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  examTargets: z.array(z.string()).optional(),
  learningGoals: z.string().optional(),
  availableHours: z.number().min(1).max(24).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export class AuthController extends BaseController {
  register = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = this.validateRequest(registerSchema, req.body);

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(validatedData.email);
      if (existingUser) {
        return this.handleError(
          res,
          "User already exists with this email",
          409,
        );
      }

      // Create new user
      const user = await UserModel.create(validatedData);

      // Generate JWT token with expected payload shape
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return this.handleSuccess(
        res,
        {
          user,
          token,
        },
        "User registered successfully",
        201,
      );
    } catch (error: any) {
      return this.handleError(res, error.message);
    }
  });

  login = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password } = this.validateRequest(loginSchema, req.body);

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return this.handleError(res, "Invalid email or password", 401);
      }

      // Verify password
      const isValidPassword = await UserModel.verifyPassword(
        password,
        user.password,
      );
      if (!isValidPassword) {
        return this.handleError(res, "Invalid email or password", 401);
      }

      // Generate JWT token with expected payload shape
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return this.handleSuccess(
        res,
        {
          user: userWithoutPassword,
          token,
        },
        "Login successful",
      );
    } catch (error: any) {
      return this.handleError(res, error.message);
    }
  });

  getProfile = this.asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        return this.handleError(res, "User not found", 404);
      }

      return this.handleSuccess(res, { user });
    } catch (error: any) {
      return this.handleServerError(res, error);
    }
  });

  updateProfile = this.asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
      const updateSchema = z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phone: z.string().optional(),
        avatar: z.string().url().optional(),
        currentLevel: z
          .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
          .optional(),
        examTargets: z.array(z.string()).optional(),
        learningGoals: z.string().optional(),
        availableHours: z.number().min(1).max(24).optional(),
        preferredTimes: z.array(z.string()).optional(),
      });

      const validatedData = this.validateRequest(updateSchema, req.body);

      const updatedUser = await UserModel.update(req.user!.id, validatedData);

      return this.handleSuccess(
        res,
        { user: updatedUser },
        "Profile updated successfully",
      );
    } catch (error: any) {
      return this.handleError(res, error.message);
    }
  });

  forgotPassword = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email } = this.validateRequest(forgotPasswordSchema, req.body);

      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return this.handleSuccess(
          res,
          null,
          "If the email exists, a reset link has been sent",
        );
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );

      // Save reset token to database
      await UserModel.setResetToken(email, resetToken);

      // TODO: Send email with reset link
      // For now, just return the token (in production, this should be sent via email)

      return this.handleSuccess(
        res,
        {
          resetToken, // Remove this in production
        },
        "Password reset link sent to your email",
      );
    } catch (error: any) {
      return this.handleError(res, error.message);
    }
  });

  resetPassword = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const { token, password } = this.validateRequest(
        resetPasswordSchema,
        req.body,
      );

      // Verify reset token
      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (error) {
        return this.handleError(res, "Invalid or expired reset token", 401);
      }

      // Find user by reset token
      const user = await UserModel.findByResetToken(token);
      if (!user || user.id !== decoded.id) {
        return this.handleError(res, "Invalid or expired reset token", 401);
      }

      // Update password and clear reset token
      await UserModel.updatePassword(user.id, password);
      await UserModel.clearResetToken(user.id);

      return this.handleSuccess(res, null, "Password reset successfully");
    } catch (error: any) {
      return this.handleError(res, error.message);
    }
  });

  verifyToken = this.asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        return this.handleError(res, "User not found", 404);
      }

      return this.handleSuccess(
        res,
        {
          user,
          valid: true,
        },
        "Token is valid",
      );
    } catch (error: any) {
      return this.handleServerError(res, error);
    }
  });

  logout = this.asyncHandler(async (req: Request, res: Response) => {
    // Since we're using stateless JWT, logout is handled on the client side
    // by removing the token from storage
    return this.handleSuccess(res, null, "Logged out successfully");
  });
}

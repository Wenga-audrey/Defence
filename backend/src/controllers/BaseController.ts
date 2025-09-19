import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class BaseController {
  protected handleSuccess(
    res: Response,
    data: any,
    message?: string,
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected handleError(res: Response, error: string, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  }

  protected handleServerError(res: Response, error: any) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }

  protected validateRequest(schema: ZodSchema, data: any) {
    try {
      return schema.parse(data);
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || "Validation failed");
    }
  }

  protected asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  protected requireAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return this.handleError(res, "Authentication required", 401);
    }
    next();
  };

  protected requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return this.handleError(res, "Insufficient permissions", 403);
      }
      next();
    };
  };
}

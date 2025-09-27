import { Request, Response, NextFunction } from "express";

// Example: Middleware to set accessibility headers for keyboard navigation
export function setAccessibilityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Headers", "TabIndex, ARIA-Role, ARIA-Label");
  next();
}
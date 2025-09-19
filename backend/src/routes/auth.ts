import express from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
const authController = new AuthController();

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Profile routes
router.get("/me", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);

// Password management
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Token verification
router.get("/verify", authenticate, authController.verifyToken);

export default router;

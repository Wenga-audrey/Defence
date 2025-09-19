import express from "express";
import { CourseController } from "../controllers/CourseController";
import { authenticate, requireInstructor } from "../middleware/auth.js";

const router = express.Router();
const courseController = new CourseController();

// Public course routes
router.get("/", courseController.getAllCourses);
router.get("/popular", courseController.getPopularCourses);
router.get("/:id", courseController.getCourseById);

// Authenticated course routes
router.get("/my/enrollments", authenticate, courseController.getUserCourses);
router.get(
  "/my/recommendations",
  authenticate,
  courseController.getRecommendedCourses,
);
router.post("/:id/enroll", authenticate, courseController.enrollInCourse);
router.get("/:id/progress", authenticate, courseController.getCourseProgress);
router.put(
  "/:id/progress",
  authenticate,
  courseController.updateCourseProgress,
);

// Admin/Instructor course management
router.post(
  "/",
  authenticate,
  requireInstructor,
  courseController.createCourse,
);
router.put(
  "/:id",
  authenticate,
  requireInstructor,
  courseController.updateCourse,
);
router.delete(
  "/:id",
  authenticate,
  requireInstructor,
  courseController.deleteCourse,
);

export default router;

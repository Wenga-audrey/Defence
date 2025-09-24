import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFound } from "./middleware/notFound.js";
import { initializeWebSocket } from "./lib/websocket.js";

// Import routes
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import assessmentRoutes from "./routes/assessments.js";
import learningPathRoutes from "./routes/learningPaths.js";
import achievementsRoutes from './routes/achievements.js';
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";
import notificationRoutes from "./routes/notifications.js";
import forumRoutes from './routes/forums.js';
import schedulerRoutes from './routes/scheduler.js';
import examSimulationRoutes from "./routes/examSimulations.js";
import profileRoutes from "./routes/profile.js";
import preparatoryClassRoutes from "./routes/preparatoryClasses.js";
import subjectRoutes from "./routes/subjects.js";
import chapterRoutes from "./routes/chapters.js";
import quizRoutes from "./routes/quizzes.js";
import paymentRoutes from "./routes/payments.js";
import fileUploadRoutes from "./routes/fileUpload.js";
import liveSessionRoutes from "./routes/liveSessions.js";
import reviewRoutes from "./routes/reviews.js";
import messageRoutes from "./routes/messages.js";
import aiRoutes from "./routes/ai.js";
import learnerRoutes from "./routes/learner.js";

dotenv.config();

const app = express();
const server = createServer(app);
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

// Test Google AI initialization
console.log("=== AI Configuration Check ===");
console.log("GOOGLE_AI_API_KEY exists:", !!process.env.GOOGLE_AI_API_KEY);
console.log("GOOGLE_AI_MODEL:", process.env.GOOGLE_AI_MODEL || "gemini-1.5-flash");

// Import and test AI service
import("./lib/googleAI.js").then(({ googleAI }) => {
  console.log("Google AI Service initialized successfully");
}).catch(error => {
  console.error("Google AI Service initialization failed:", error);
});

// CORS Configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:3000'
];

// Enable CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count');
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/learning-paths", learningPathRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/forums", forumRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/exam-simulations", examSimulationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/classes", preparatoryClassRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", fileUploadRoutes);
app.use("/api/live-sessions", liveSessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/scheduler', schedulerRoutes); // Re-add scheduling route
app.use("/api/ai", aiRoutes);
app.use("/api/learner", learnerRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize WebSocket
const webSocketService = initializeWebSocket(server);
console.log(" WebSocket service initialized");

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(` Mindboost API server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` WebSocket server ready for real-time connections`);
});

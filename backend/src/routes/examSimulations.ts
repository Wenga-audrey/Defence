import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Get exam simulations for a module
router.get("/module/:moduleId", async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { year, isOfficial } = req.query;

    const where: any = { examModuleId: moduleId };
    if (year) where.year = parseInt(year as string);
    if (isOfficial !== undefined) where.isOfficial = isOfficial === 'true';

    const simulations = await prisma.examSimulation.findMany({
      where,
      include: {
        examModule: {
          select: { name: true, code: true }
        },
        _count: {
          select: {
            questions: true,
            results: true
          }
        }
      },
      orderBy: [
        { isOfficial: 'desc' },
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: simulations
    });
  } catch (error) {
    next(error);
  }
});

// Get specific simulation
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const simulation = await prisma.examSimulation.findUnique({
      where: { id },
      include: {
        examModule: true,
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            difficulty: true,
            points: true,
            order: true,
            syllabusTopicId: true,
            syllabusTopic: {
              select: { title: true }
            }
          }
        },
        _count: {
          select: { results: true }
        }
      }
    });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    res.json({
      success: true,
      data: simulation
    });
  } catch (error) {
    next(error);
  }
});

// Start simulation (for authenticated users)
router.post("/:id/start", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user already has an active session
    const existingResult = await prisma.simulationResult.findFirst({
      where: {
        userId,
        examSimulationId: id,
        completedAt: null
      }
    });

    if (existingResult) {
      return res.status(400).json({ 
        error: "You already have an active simulation session",
        resultId: existingResult.id
      });
    }

    const simulation = await prisma.examSimulation.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            difficulty: true,
            points: true,
            order: true,
            syllabusTopicId: true,
            syllabusTopic: {
              select: { title: true }
            }
          }
        }
      }
    });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    // Create simulation result record
    const result = await prisma.simulationResult.create({
      data: {
        userId,
        examSimulationId: id,
        score: 0,
        maxScore: simulation.questions.reduce((sum, q) => sum + q.points, 0),
        timeSpent: 0,
        answers: {}
      }
    });

    res.json({
      success: true,
      data: {
        resultId: result.id,
        simulation: {
          id: simulation.id,
          title: simulation.title,
          duration: simulation.duration,
          questionCount: simulation.questionCount,
          passingScore: simulation.passingScore
        },
        questions: simulation.questions,
        startTime: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

// Submit simulation answers
router.post("/:id/submit", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { resultId, answers, timeSpent } = req.body;

    if (!resultId || !answers) {
      return res.status(400).json({ error: "Result ID and answers are required" });
    }

    // Get simulation with questions and correct answers
    const simulation = await prisma.examSimulation.findUnique({
      where: { id },
      include: {
        questions: true
      }
    });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    // Calculate score
    let score = 0;
    const detailedAnswers: any = {};

    simulation.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score += question.points;
      }

      detailedAnswers[question.id] = {
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
        explanation: question.explanation
      };
    });

    // Update simulation result
    const result = await prisma.simulationResult.update({
      where: { id: resultId },
      data: {
        score,
        timeSpent: timeSpent || 0,
        completedAt: new Date(),
        answers: detailedAnswers
      },
      include: {
        examSimulation: {
          include: {
            examModule: true
          }
        }
      }
    });

    // Calculate performance metrics
    const percentage = (score / result.maxScore) * 100;
    const passed = percentage >= result.examSimulation.passingScore;

    // Analyze weak areas
    const topicPerformance = new Map();
    simulation.questions.forEach(question => {
      if (question.syllabusTopicId) {
        const topicId = question.syllabusTopicId;
        if (!topicPerformance.has(topicId)) {
          topicPerformance.set(topicId, { correct: 0, total: 0 });
        }
        const performance = topicPerformance.get(topicId);
        performance.total++;
        if (detailedAnswers[question.id].isCorrect) {
          performance.correct++;
        }
      }
    });

    const weakAreas = Array.from(topicPerformance.entries())
      .filter(([_, perf]: [string, any]) => (perf.correct / perf.total) < 0.7)
      .map(([topicId, perf]: [string, any]) => ({
        topicId,
        accuracy: (perf.correct / perf.total) * 100,
        questionsAttempted: perf.total
      }));

    res.json({
      success: true,
      data: {
        result: {
          id: result.id,
          score,
          maxScore: result.maxScore,
          percentage: Math.round(percentage),
          passed,
          timeSpent: result.timeSpent,
          completedAt: result.completedAt
        },
        analysis: {
          weakAreas,
          topicPerformance: Array.from(topicPerformance.entries()).map(([topicId, perf]: [string, any]) => ({
            topicId,
            accuracy: Math.round((perf.correct / perf.total) * 100),
            questionsAttempted: perf.total
          }))
        },
        detailedAnswers
      },
      message: passed ? "Congratulations! You passed the simulation." : "Keep practicing to improve your score."
    });
  } catch (error) {
    next(error);
  }
});

// Get user's simulation results
router.get("/results/user", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { moduleId, limit = 10 } = req.query;

    const where: any = { userId };
    if (moduleId) {
      where.examSimulation = { examModuleId: moduleId };
    }

    const results = await prisma.simulationResult.findMany({
      where,
      include: {
        examSimulation: {
          include: {
            examModule: {
              select: { name: true, code: true }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: parseInt(limit as string)
    });

    const formattedResults = results.map(result => ({
      id: result.id,
      examModule: result.examSimulation.examModule,
      simulationTitle: result.examSimulation.title,
      score: result.score,
      maxScore: result.maxScore,
      percentage: Math.round((result.score / result.maxScore) * 100),
      passed: (result.score / result.maxScore) * 100 >= result.examSimulation.passingScore,
      timeSpent: result.timeSpent,
      completedAt: result.completedAt,
      isOfficial: result.examSimulation.isOfficial,
      year: result.examSimulation.year
    }));

    res.json({
      success: true,
      data: formattedResults
    });
  } catch (error) {
    next(error);
  }
});

// Create simulation (Admin only)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const {
      examModuleId,
      title,
      description,
      duration,
      questionCount,
      passingScore,
      isOfficial,
      year
    } = req.body;

    if (!examModuleId || !title || !duration || !questionCount) {
      return res.status(400).json({ 
        error: "Exam module ID, title, duration, and question count are required" 
      });
    }

    const simulation = await prisma.examSimulation.create({
      data: {
        examModuleId,
        title,
        description,
        duration,
        questionCount,
        passingScore: passingScore || 50,
        isOfficial: isOfficial || false,
        year
      },
      include: {
        examModule: true
      }
    });

    res.status(201).json({
      success: true,
      data: simulation,
      message: "Exam simulation created successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Add questions to simulation (Admin only)
router.post("/:id/questions", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: "Questions must be an array" });
    }

    const createdQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const question = await prisma.question.create({
        data: {
          assessmentId: id, // Using assessmentId for compatibility
          examSimulationId: id,
          question: q.question,
          type: q.type || 'multiple-choice',
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty || 'MEDIUM',
          points: q.points || 1,
          order: i + 1,
          topic: q.topic,
          syllabusTopicId: q.syllabusTopicId
        }
      });
      createdQuestions.push(question);
    }

    res.status(201).json({
      success: true,
      data: createdQuestions,
      message: `Added ${createdQuestions.length} questions to simulation`
    });
  } catch (error) {
    next(error);
  }
});

// Get simulation statistics (Admin only)
router.get("/:id/statistics", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const [simulation, results] = await Promise.all([
      prisma.examSimulation.findUnique({
        where: { id },
        include: {
          examModule: true,
          _count: { select: { questions: true } }
        }
      }),
      prisma.simulationResult.findMany({
        where: { 
          examSimulationId: id,
          completedAt: { not: null }
        },
        include: {
          user: {
            select: { firstName: true, lastName: true }
          }
        }
      })
    ]);

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    const totalAttempts = results.length;
    const averageScore = totalAttempts > 0 
      ? results.reduce((sum, r) => sum + (r.score / r.maxScore), 0) / totalAttempts * 100
      : 0;
    
    const passRate = totalAttempts > 0
      ? (results.filter(r => (r.score / r.maxScore) * 100 >= simulation.passingScore).length / totalAttempts) * 100
      : 0;

    const averageTime = totalAttempts > 0
      ? results.reduce((sum, r) => sum + r.timeSpent, 0) / totalAttempts
      : 0;

    res.json({
      success: true,
      data: {
        simulation: {
          id: simulation.id,
          title: simulation.title,
          examModule: simulation.examModule,
          questionCount: simulation._count.questions,
          duration: simulation.duration,
          passingScore: simulation.passingScore
        },
        statistics: {
          totalAttempts,
          averageScore: Math.round(averageScore),
          passRate: Math.round(passRate),
          averageTime: Math.round(averageTime),
          recentResults: results.slice(-10).map(r => ({
            userName: `${r.user.firstName} ${r.user.lastName}`,
            score: r.score,
            maxScore: r.maxScore,
            percentage: Math.round((r.score / r.maxScore) * 100),
            timeSpent: r.timeSpent,
            completedAt: r.completedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

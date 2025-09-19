import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Get all exam modules
router.get("/", async (req, res, next) => {
  try {
    const { active } = req.query;
    
    const where = active === 'true' ? { isActive: true } : {};
    
    const examModules = await prisma.examModule.findMany({
      where,
      include: {
        syllabusTopics: {
          where: { parentId: null }, // Only root topics
          include: {
            children: {
              include: {
                children: true // Support 3-level hierarchy
              }
            }
          }
        },
        courses: {
          select: {
            id: true,
            title: true,
            isPublished: true
          }
        },
        _count: {
          select: {
            examSimulations: true,
            courses: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: examModules
    });
  } catch (error) {
    next(error);
  }
});

// Get specific exam module
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const examModule = await prisma.examModule.findUnique({
      where: { id },
      include: {
        syllabusTopics: {
          include: {
            parent: true,
            children: true,
            lessons: {
              select: {
                id: true,
                title: true,
                order: true
              }
            },
            questions: {
              select: {
                id: true,
                question: true,
                difficulty: true
              }
            }
          }
        },
        courses: {
          include: {
            lessons: {
              select: { id: true }
            },
            enrollments: {
              select: { id: true }
            }
          }
        },
        examSimulations: {
          include: {
            results: {
              select: {
                id: true,
                score: true,
                maxScore: true
              }
            }
          }
        }
      }
    });

    if (!examModule) {
      return res.status(404).json({ error: "Exam module not found" });
    }

    res.json({
      success: true,
      data: examModule
    });
  } catch (error) {
    next(error);
  }
});

// Create exam module (Admin only)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const {
      name,
      code,
      description,
      syllabus,
      examDate,
      duration,
      passingScore
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: "Name and code are required" });
    }

    const examModule = await prisma.examModule.create({
      data: {
        name,
        code,
        description,
        syllabus,
        examDate: examDate ? new Date(examDate) : null,
        duration,
        passingScore: passingScore || 50
      }
    });

    res.status(201).json({
      success: true,
      data: examModule,
      message: "Exam module created successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Update exam module (Admin only)
router.put("/:id", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.examDate) {
      updateData.examDate = new Date(updateData.examDate);
    }

    const examModule = await prisma.examModule.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: examModule,
      message: "Exam module updated successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Create syllabus topic
router.post("/:id/topics", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id: examModuleId } = req.params;
    const { title, description, weight, parentId, order, isRequired } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const syllabusTopic = await prisma.syllabusTopic.create({
      data: {
        examModuleId,
        title,
        description,
        weight: weight || 1,
        parentId,
        order: order || 0,
        isRequired: isRequired !== false
      },
      include: {
        parent: true,
        children: true
      }
    });

    res.status(201).json({
      success: true,
      data: syllabusTopic,
      message: "Syllabus topic created successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Update syllabus topic
router.put("/topics/:topicId", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { topicId } = req.params;
    const updateData = req.body;

    const syllabusTopic = await prisma.syllabusTopic.update({
      where: { id: topicId },
      data: updateData,
      include: {
        parent: true,
        children: true
      }
    });

    res.json({
      success: true,
      data: syllabusTopic,
      message: "Syllabus topic updated successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Delete syllabus topic
router.delete("/topics/:topicId", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { topicId } = req.params;

    await prisma.syllabusTopic.delete({
      where: { id: topicId }
    });

    res.json({
      success: true,
      message: "Syllabus topic deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Get exam statistics
router.get("/:id/statistics", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const [
      examModule,
      totalStudents,
      totalSimulations,
      averageScore,
      topicPerformance
    ] = await Promise.all([
      prisma.examModule.findUnique({
        where: { id },
        select: { name: true, code: true }
      }),
      prisma.user.count({
        where: {
          enrollments: {
            some: {
              course: {
                examModuleId: id
              }
            }
          }
        }
      }),
      prisma.simulationResult.count({
        where: {
          examSimulation: {
            examModuleId: id
          }
        }
      }),
      prisma.simulationResult.aggregate({
        where: {
          examSimulation: {
            examModuleId: id
          }
        },
        _avg: {
          score: true
        }
      }),
      // Topic performance analysis
      prisma.syllabusTopic.findMany({
        where: { examModuleId: id },
        include: {
          questions: {
            include: {
              userAnswers: {
                select: {
                  isCorrect: true
                }
              }
            }
          }
        }
      })
    ]);

    if (!examModule) {
      return res.status(404).json({ error: "Exam module not found" });
    }

    // Calculate topic performance
    const topicStats = topicPerformance.map(topic => {
      const totalAnswers = topic.questions.reduce((sum, q) => sum + q.userAnswers.length, 0);
      const correctAnswers = topic.questions.reduce((sum, q) => 
        sum + q.userAnswers.filter(a => a.isCorrect).length, 0);
      
      return {
        topicId: topic.id,
        title: topic.title,
        weight: topic.weight,
        accuracy: totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0,
        questionsAttempted: totalAnswers
      };
    });

    res.json({
      success: true,
      data: {
        examModule,
        totalStudents,
        totalSimulations,
        averageScore: averageScore._avg.score || 0,
        topicPerformance: topicStats.sort((a, b) => a.accuracy - b.accuracy)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Seed Cameroonian exam modules
router.post("/seed-cameroon-exams", authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const cameroonExams = [
      {
        name: "École Nationale d'Administration et de Magistrature",
        code: "ENAM",
        description: "Competitive exam for entry into Cameroon's National School of Administration and Magistracy",
        duration: 240, // 4 hours
        passingScore: 60,
        syllabus: {
          sections: [
            "General Culture",
            "Mathematics",
            "French Language",
            "English Language",
            "Economics",
            "Law",
            "Current Affairs"
          ]
        }
      },
      {
        name: "École Normale Supérieure",
        code: "ENS",
        description: "Competitive exam for entry into Cameroon's Higher Teacher Training College",
        duration: 300, // 5 hours
        passingScore: 55,
        syllabus: {
          sections: [
            "Subject Specialization",
            "General Pedagogy",
            "Educational Psychology",
            "French Language",
            "English Language",
            "General Culture"
          ]
        }
      },
      {
        name: "Police Nationale",
        code: "POLICE",
        description: "Competitive exam for recruitment into Cameroon National Police",
        duration: 180, // 3 hours
        passingScore: 50,
        syllabus: {
          sections: [
            "General Culture",
            "Mathematics",
            "French Language",
            "English Language",
            "Civic Education",
            "Current Affairs",
            "Physical Fitness"
          ]
        }
      },
      {
        name: "Douanes Camerounaises",
        code: "CUSTOMS",
        description: "Competitive exam for recruitment into Cameroon Customs Service",
        duration: 210, // 3.5 hours
        passingScore: 55,
        syllabus: {
          sections: [
            "Economics",
            "International Trade",
            "Mathematics",
            "French Language",
            "English Language",
            "General Culture",
            "Customs Regulations"
          ]
        }
      },
      {
        name: "Gendarmerie Nationale",
        code: "GENDARMERIE",
        description: "Competitive exam for recruitment into Cameroon National Gendarmerie",
        duration: 180, // 3 hours
        passingScore: 50,
        syllabus: {
          sections: [
            "General Culture",
            "Mathematics",
            "French Language",
            "English Language",
            "Civic Education",
            "Military Knowledge",
            "Physical Fitness"
          ]
        }
      }
    ];

    const createdExams = [];

    for (const exam of cameroonExams) {
      // Check if exam already exists
      const existing = await prisma.examModule.findUnique({
        where: { code: exam.code }
      });

      if (!existing) {
        const examModule = await prisma.examModule.create({
          data: exam
        });

        // Create syllabus topics
        for (let i = 0; i < exam.syllabus.sections.length; i++) {
          await prisma.syllabusTopic.create({
            data: {
              examModuleId: examModule.id,
              title: exam.syllabus.sections[i],
              description: `${exam.syllabus.sections[i]} section for ${exam.name}`,
              weight: exam.syllabus.sections[i] === "Subject Specialization" ? 3 : 1,
              order: i,
              isRequired: true
            }
          });
        }

        createdExams.push(examModule);
      }
    }

    res.json({
      success: true,
      data: createdExams,
      message: `Seeded ${createdExams.length} Cameroonian exam modules`
    });
  } catch (error) {
    next(error);
  }
});

export default router;

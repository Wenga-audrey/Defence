import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateAssessmentData {
  title: string;
  description?: string;
  type: string;
  timeLimit?: number;
  passingScore: number;
  lessonId: string;
  questions: any[];
}

export interface SubmitAssessmentData {
  answers: Record<string, any>;
  timeSpent: number;
}

export class AssessmentModel {
  static async findById(id: string) {
    return await prisma.assessment.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                examType: true,
                level: true,
              },
            },
          },
        },
      },
    });
  }

  static async findByLessonId(lessonId: string) {
    return await prisma.assessment.findMany({
      where: { lessonId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async create(assessmentData: CreateAssessmentData) {
    return await prisma.assessment.create({
      data: {
        title: assessmentData.title,
        description: assessmentData.description,
        type: assessmentData.type,
        timeLimit: assessmentData.timeLimit,
        passingScore: assessmentData.passingScore,
        lessonId: assessmentData.lessonId,
        questions: {
          create: assessmentData.questions.map((q: any, index: number) => ({
            question: q.question,
            type: q.type,
            options: JSON.stringify(q.options || []),
            correctAnswer: JSON.stringify(q.correctAnswer),
            explanation: q.explanation,
            order: index + 1,
          })),
        },
      },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  static async submit(
    userId: string,
    assessmentId: string,
    submissionData: SubmitAssessmentData,
  ) {
    const assessment = await this.findById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    // Check if already submitted
    const existingResult = await prisma.assessmentResult.findFirst({
      where: {
        userId,
        assessmentId,
      },
    });

    if (existingResult) {
      throw new Error("Assessment already submitted");
    }

    // Get questions for scoring
    const questions = await prisma.question.findMany({
      where: { assessmentId },
      orderBy: { order: "asc" },
    });

    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach((question: any, index: number) => {
      const userAnswer = submissionData.answers[index.toString()];
      const correctAnswer = JSON.parse(question.correctAnswer);

      if (question.type === "multiple_choice") {
        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
      } else if (question.type === "true_false") {
        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= assessment.passingScore;

    // Save result
    const result = await prisma.assessmentResult.create({
      data: {
        userId,
        assessmentId,
        score,
        totalPoints: totalQuestions,
        timeSpent: submissionData.timeSpent,
        answers: {
          create: Object.entries(submissionData.answers).map(
            ([questionIndex, answer]) => {
              const question = questions[parseInt(questionIndex)];
              const correctAnswer = JSON.parse(question.correctAnswer);
              return {
                questionId: question.id,
                answer: JSON.stringify(answer),
                isCorrect: answer === correctAnswer,
                timeSpent: Math.floor(
                  submissionData.timeSpent / totalQuestions,
                ),
              };
            },
          ),
        },
      },
      include: {
        assessment: {
          include: {
            lesson: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    return {
      result,
      feedback: {
        score,
        passed,
        correctAnswers,
        totalQuestions,
        passingScore: assessment.passingScore,
      },
    };
  }

  static async getUserResults(userId: string, assessmentId?: string) {
    const where: any = { userId };
    if (assessmentId) {
      where.assessmentId = assessmentId;
    }

    return await prisma.assessmentResult.findMany({
      where,
      include: {
        assessment: {
          include: {
            lesson: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    examType: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });
  }

  static async getAssessmentAnalytics(assessmentId: string) {
    const results = await prisma.assessmentResult.findMany({
      where: { assessmentId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const totalAttempts = results.length;
    const averageScore =
      totalAttempts > 0
        ? Math.round(
            results.reduce((sum, result) => sum + result.score, 0) /
              totalAttempts,
          )
        : 0;
    const passRate =
      totalAttempts > 0
        ? Math.round(
            (results.filter((r) => r.passed).length / totalAttempts) * 100,
          )
        : 0;

    return {
      totalAttempts,
      averageScore,
      passRate,
      results: results.slice(0, 10), // Latest 10 results
    };
  }

  static async generateAdaptiveQuestions(
    userId: string,
    examType: string,
    difficulty: string = "INTERMEDIATE",
  ) {
    // Get user's performance history
    const userResults = await this.getUserResults(userId);

    // Analyze weak areas
    const weakAreas = this.analyzeWeakAreas(userResults);

    // Use Google AI to generate questions
    const { googleAI } = await import("../lib/googleAI.js");
    const aiResponse = await googleAI.generateText(
      `Generate 5 ${difficulty} level multiple choice questions for ${examType} exam focusing on: ${weakAreas.join(", ")}`,
    );

    if (aiResponse.success) {
      try {
        return JSON.parse(aiResponse.content || "[]");
      } catch (error) {
        console.error("Failed to parse AI questions:", error);
      }
    }

    // Fallback to default questions
    return this.getDefaultQuestions(examType, difficulty);
  }

  private static analyzeWeakAreas(results: any[]) {
    const weakAreas: string[] = [];
    const coursePerformance = new Map();

    results.forEach((result) => {
      if (result.assessment?.lesson?.course) {
        const courseTitle = result.assessment.lesson.course.title;
        const existing = coursePerformance.get(courseTitle) || {
          total: 0,
          count: 0,
        };
        coursePerformance.set(courseTitle, {
          total: existing.total + result.score,
          count: existing.count + 1,
        });
      }
    });

    // Find areas with average score < 70%
    Array.from(coursePerformance.entries())
      .filter(([_, perf]) => perf.total / perf.count < 70)
      .forEach(([courseTitle, _]) => weakAreas.push(courseTitle));

    return weakAreas.length > 0 ? weakAreas : ["general knowledge"];
  }

  private static getDefaultQuestions(examType: string, difficulty: string) {
    // Default fallback questions
    return [
      {
        type: "multiple_choice",
        question: `Sample ${examType} question for ${difficulty} level`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "This is a sample question.",
      },
    ];
  }
}

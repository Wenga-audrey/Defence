import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateQuizQuestions } from '../lib/aiQuizGenerator.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get chapter quiz
router.get('/chapter/:chapterId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user!.id;

    const quiz = await prisma.chapterQuiz.findFirst({
      where: {
        chapterId,
        isActive: true
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        results: {
          where: { userId },
          orderBy: { completedAt: 'desc' },
          take: 1
        },
        chapter: {
          include: {
            subject: {
              include: {
                class: true
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found for this chapter' });
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
});

// Get subject quiz
router.get('/subject/:subjectId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user!.id;

    const quiz = await prisma.subjectQuiz.findFirst({
      where: {
        subjectId,
        isActive: true
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        results: {
          where: { userId },
          orderBy: { completedAt: 'desc' },
          take: 1
        },
        subject: {
          include: {
            class: true,
            chapters: {
              where: { isPublished: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found for this subject' });
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
});

// Create chapter quiz (Teachers and Prep Admin)
router.post('/chapter', authenticate, requireRole(['TEACHER', 'PREP_ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const {
      chapterId,
      title,
      description,
      timeLimit,
      passingScore,
      generateWithAI = false
    } = req.body;

    const quiz = await prisma.chapterQuiz.create({
      data: {
        chapterId,
        title,
        description,
        timeLimit: parseInt(timeLimit),
        passingScore: parseInt(passingScore),
        isActive: true
      }
    });

    // Generate AI questions if requested
    if (generateWithAI) {
      try {
        const chapter = await prisma.chapter.findUnique({
          where: { id: chapterId },
          include: {
            lessons: {
              where: { isPublished: true }
            },
            subject: true
          }
        });

        if (chapter) {
          const aiQuestions = await generateQuizQuestions(chapter, 'chapter');
          
          if (aiQuestions && aiQuestions.length > 0) {
            await prisma.quizQuestion.createMany({
              data: aiQuestions.map((q, index) => ({
                chapterQuizId: quiz.id,
                question: q.question,
                type: q.type,
                options: q.options ? JSON.stringify(q.options) : null,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                difficulty: q.difficulty,
                points: q.points || 1,
                order: index + 1,
                isAIGenerated: true
              }))
            });
          }
        }
      } catch (aiError) {
        console.error('AI question generation failed:', aiError);
        // Continue without AI questions
      }
    }

    const completeQuiz = await prisma.chapterQuiz.findUnique({
      where: { id: quiz.id },
      include: {
        questions: true
      }
    });

    res.status(201).json(completeQuiz);
  } catch (error) {
    next(error);
  }
});

// Create subject quiz (Teachers and Prep Admin)
router.post('/subject', authenticate, requireRole(['TEACHER', 'PREP_ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const {
      subjectId,
      title,
      description,
      timeLimit,
      passingScore,
      generateWithAI = false
    } = req.body;

    const quiz = await prisma.subjectQuiz.create({
      data: {
        subjectId,
        title,
        description,
        timeLimit: parseInt(timeLimit),
        passingScore: parseInt(passingScore),
        isActive: true
      }
    });

    // Generate AI questions if requested
    if (generateWithAI) {
      try {
        const subject = await prisma.subject.findUnique({
          where: { id: subjectId },
          include: {
            chapters: {
              where: { isPublished: true },
              include: {
                lessons: {
                  where: { isPublished: true }
                }
              }
            }
          }
        });

        if (subject) {
          const aiQuestions = await generateQuizQuestions(subject, 'subject');
          
          if (aiQuestions && aiQuestions.length > 0) {
            await prisma.quizQuestion.createMany({
              data: aiQuestions.map((q, index) => ({
                subjectQuizId: quiz.id,
                question: q.question,
                type: q.type,
                options: q.options ? JSON.stringify(q.options) : null,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                difficulty: q.difficulty,
                points: q.points || 1,
                order: index + 1,
                isAIGenerated: true
              }))
            });
          }
        }
      } catch (aiError) {
        console.error('AI question generation failed:', aiError);
      }
    }

    const completeQuiz = await prisma.subjectQuiz.findUnique({
      where: { id: quiz.id },
      include: {
        questions: true
      }
    });

    res.status(201).json(completeQuiz);
  } catch (error) {
    next(error);
  }
});

// Submit quiz attempt
router.post('/:quizId/submit', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers, timeSpent, quizType } = req.body; // quizType: 'chapter' or 'subject'
    const userId = req.user!.id;

    let quiz;
    let quizData: any = {};

    if (quizType === 'chapter') {
      quiz = await prisma.chapterQuiz.findUnique({
        where: { id: quizId },
        include: {
          questions: true,
          chapter: {
            include: {
              subject: true
            }
          }
        }
      });
      quizData.chapterQuizId = quizId;
    } else {
      quiz = await prisma.subjectQuiz.findUnique({
        where: { id: quizId },
        include: {
          questions: true,
          subject: {
            include: {
              chapters: true
            }
          }
        }
      });
      quizData.subjectQuizId = quizId;
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const detailedAnswers = [];
    const weakAreas = [];

    for (const question of quiz.questions) {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score += question.points;
      } else {
        // Track weak areas for AI analysis
        weakAreas.push({
          questionId: question.id,
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty
        });
      }

      detailedAnswers.push({
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
        explanation: question.explanation
      });
    }

    // Generate AI suggestions based on weak areas
    let suggestions = null;
    if (weakAreas.length > 0) {
      try {
        suggestions = await generateStudySuggestions(weakAreas, quiz);
      } catch (error) {
        console.error('Failed to generate AI suggestions:', error);
      }
    }

    // Save quiz result
    const result = await prisma.quizResult.create({
      data: {
        userId,
        ...quizData,
        score,
        maxScore,
        timeSpent: parseInt(timeSpent),
        answers: JSON.stringify(detailedAnswers),
        weakAreas: weakAreas.length > 0 ? JSON.stringify(weakAreas) : null,
        suggestions: suggestions ? JSON.stringify(suggestions) : null
      }
    });

    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= quiz.passingScore;

    res.json({
      result: {
        id: result.id,
        score,
        maxScore,
        percentage,
        passed,
        timeSpent,
        weakAreas,
        suggestions,
        detailedAnswers
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get quiz results for a user
router.get('/results/my', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '20' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [chapterResults, subjectResults] = await Promise.all([
      prisma.quizResult.findMany({
        where: {
          userId,
          chapterQuizId: { not: null }
        },
        include: {
          chapterQuiz: {
            include: {
              chapter: {
                include: {
                  subject: {
                    include: {
                      class: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        skip,
        take: Math.floor(take / 2)
      }),
      prisma.quizResult.findMany({
        where: {
          userId,
          subjectQuizId: { not: null }
        },
        include: {
          subjectQuiz: {
            include: {
              subject: {
                include: {
                  class: true
                }
              }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        skip,
        take: Math.ceil(take / 2)
      })
    ]);

    const allResults = [...chapterResults, ...subjectResults]
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

    res.json({
      results: allResults,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: allResults.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Generate AI suggestions helper function
async function generateStudySuggestions(weakAreas: any[], quiz: any) {
  // This would integrate with your AI service
  // For now, return basic suggestions
  const suggestions = {
    overallFeedback: `You scored below the passing grade. Focus on reviewing the following areas.`,
    studyPlan: weakAreas.map(area => ({
      topic: area.question.substring(0, 50) + '...',
      suggestion: `Review the concepts related to this question and practice similar problems.`,
      difficulty: area.difficulty
    })),
    recommendedActions: [
      'Review the chapter content again',
      'Practice more questions on weak topics',
      'Ask questions in the forum',
      'Schedule a study session with classmates'
    ]
  };

  return suggestions;
}

export default router;

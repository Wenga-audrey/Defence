import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

export interface UserLearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  difficultyPreference: 'adaptive' | 'challenging' | 'comfortable';
  retentionRate: number;
  strongSubjects: string[];
  weakSubjects: string[];
  optimalSessionLength: number;
  preferredTimeSlots: string[];
}

export interface PersonalizedRecommendation {
  type: 'lesson' | 'assessment' | 'review' | 'break';
  courseId: string;
  difficulty: string;
  estimatedDuration: number;
  priority: number;
  reasoning: string;
}

export interface SuccessPrediction {
  examName: string;
  currentProbability: number;
  targetProbability: number;
  timeToTarget: number;
  confidenceLevel: number;
}

export class PersonalizationEngine {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  }

  async buildLearningProfile(userId: string): Promise<UserLearningProfile> {
    const [studySessions, assessmentResults] = await Promise.all([
      prisma.studySession.findMany({
        where: { userId },
        take: 30
      }),
      prisma.assessmentResult.findMany({
        where: { userId },
        include: {
          assessment: {
            include: {
              course: { select: { examType: true } }
            }
          }
        },
        take: 20
      })
    ]);

    // Calculate optimal session length
    const sessionDurations = studySessions
      .filter(s => s.endTime)
      .map(s => (new Date(s.endTime!).getTime() - new Date(s.startTime).getTime()) / (1000 * 60));

    const optimalSessionLength = sessionDurations.length > 0
      ? Math.round(sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length)
      : 30;

    // Analyze subject performance
    const subjectPerformance = new Map<string, number[]>();
    assessmentResults.forEach(result => {
      const subject = result.assessment.course.examType;
      const score = (result.score / result.maxScore) * 100;
      
      if (!subjectPerformance.has(subject)) {
        subjectPerformance.set(subject, []);
      }
      subjectPerformance.get(subject)!.push(score);
    });

    const strongSubjects = Array.from(subjectPerformance.entries())
      .filter(([_, scores]) => scores.length >= 3 && scores.reduce((sum, s) => sum + s, 0) / scores.length >= 75)
      .map(([subject]) => subject);

    const weakSubjects = Array.from(subjectPerformance.entries())
      .filter(([_, scores]) => scores.length >= 3 && scores.reduce((sum, s) => sum + s, 0) / scores.length < 60)
      .map(([subject]) => subject);

    // Calculate retention rate
    const recentScores = assessmentResults.slice(0, 10).map(r => (r.score / r.maxScore) * 100);
    const retentionRate = recentScores.length > 0
      ? recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length / 100
      : 0.5;

    // Analyze preferred time slots
    const hourCounts = new Map<number, number>();
    studySessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    const preferredTimeSlots = Array.from(hourCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour.toString().padStart(2, '0')}:00`);

    return {
      userId,
      learningStyle: optimalSessionLength > 45 ? 'reading' : 'visual',
      difficultyPreference: 'adaptive',
      retentionRate,
      strongSubjects,
      weakSubjects,
      optimalSessionLength,
      preferredTimeSlots
    };
  }

  async generatePersonalizedRecommendations(userId: string): Promise<PersonalizedRecommendation[]> {
    const profile = await this.buildLearningProfile(userId);
    
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: { userId }
                }
              }
            }
          }
        }
      }
    });

    const recommendations: PersonalizedRecommendation[] = [];

    for (const enrollment of enrollments) {
      const incompleteLessons = enrollment.course.lessons.filter(
        lesson => !lesson.progress.some(p => p.completedAt)
      );

      if (incompleteLessons.length > 0) {
        const nextLesson = incompleteLessons[0];
        
        recommendations.push({
          type: 'lesson',
          courseId: enrollment.course.id,
          difficulty: profile.weakSubjects.includes(enrollment.course.examType) ? 'easy' : 'medium',
          estimatedDuration: profile.optimalSessionLength,
          priority: profile.weakSubjects.includes(enrollment.course.examType) ? 8 : 5,
          reasoning: profile.weakSubjects.includes(enrollment.course.examType) 
            ? 'Focus on weak subject area' 
            : 'Continue regular progress'
        });
      }
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  async predictExamSuccess(userId: string, examModuleId: string): Promise<SuccessPrediction> {
    const [profile, examModule, userResults] = await Promise.all([
      this.buildLearningProfile(userId),
      prisma.examModule.findUnique({ where: { id: examModuleId } }),
      prisma.simulationResult.findMany({
        where: {
          userId,
          examSimulation: { examModuleId }
        },
        orderBy: { completedAt: 'desc' },
        take: 5
      })
    ]);

    if (!examModule) {
      throw new Error('Exam module not found');
    }

    // Calculate current probability based on recent performance
    const recentScores = userResults.map(r => (r.score / r.maxScore) * 100);
    const averageScore = recentScores.length > 0 
      ? recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
      : 0;

    const currentProbability = Math.min(averageScore / examModule.passingScore, 1) * 100;
    const targetProbability = 85; // Target 85% success probability
    
    // Estimate time to target based on learning rate
    const improvementNeeded = Math.max(0, examModule.passingScore - averageScore);
    const timeToTarget = Math.ceil(improvementNeeded / (profile.retentionRate * 10)); // Rough estimate

    return {
      examName: examModule.name,
      currentProbability: Math.round(currentProbability),
      targetProbability,
      timeToTarget,
      confidenceLevel: recentScores.length >= 3 ? 80 : 60
    };
  }
}

export const personalizationEngine = new PersonalizationEngine();

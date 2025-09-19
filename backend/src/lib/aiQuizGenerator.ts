import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface QuizQuestion {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  points?: number;
  topic?: string;
  skillLevel?: string;
}

interface LearnerProfile {
  userId: string;
  currentLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  weakAreas: string[];
  strongAreas: string[];
  averageScore: number;
  recentPerformance: number[];
  preferredDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface AdaptiveQuizConfig {
  learnerProfile: LearnerProfile;
  targetDifficulty?: string;
  focusAreas?: string[];
  questionCount: number;
  adaptToPerformance: boolean;
}

export async function generateAdaptiveQuizQuestions(
  content: any, 
  type: 'chapter' | 'subject',
  config: AdaptiveQuizConfig
): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Determine optimal difficulty distribution based on learner profile
    const difficultyDistribution = calculateDifficultyDistribution(config.learnerProfile);
    
    let prompt = buildAdaptivePrompt(content, type, config, difficultyDistribution);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    // Post-process questions for adaptive learning
    return adaptQuestionsToLearner(questions, config.learnerProfile);

  } catch (error) {
    console.error('Adaptive AI Quiz Generation Error:', error);
    return generateAdaptiveFallbackQuestions(content, type, config);
  }
}

// Legacy function for backward compatibility
export async function generateQuizQuestions(content: any, type: 'chapter' | 'subject'): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Use default learner profile for legacy function
    const defaultConfig: AdaptiveQuizConfig = {
      learnerProfile: {
        userId: 'default',
        currentLevel: 'INTERMEDIATE',
        weakAreas: [],
        strongAreas: [],
        averageScore: 70,
        recentPerformance: [70, 75, 65],
        preferredDifficulty: 'MEDIUM'
      },
      questionCount: type === 'chapter' ? 6 : 12,
      adaptToPerformance: false
    };
    
    return generateAdaptiveQuizQuestions(content, type, defaultConfig);
  } catch (error) {
    console.error('AI Quiz Generation Error:', error);
    return generateFallbackQuestions(content, type);
  }
}

function calculateDifficultyDistribution(profile: LearnerProfile): { easy: number, medium: number, hard: number } {
  const { currentLevel, averageScore, recentPerformance } = profile;
  
  // Calculate recent trend
  const recentAvg = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length;
  const isImproving = recentAvg > averageScore;
  
  let distribution = { easy: 0.3, medium: 0.5, hard: 0.2 };
  
  if (currentLevel === 'BEGINNER' || averageScore < 60) {
    distribution = { easy: 0.5, medium: 0.4, hard: 0.1 };
  } else if (currentLevel === 'ADVANCED' || averageScore > 85) {
    distribution = { easy: 0.1, medium: 0.4, hard: 0.5 };
  } else if (isImproving) {
    distribution = { easy: 0.2, medium: 0.5, hard: 0.3 };
  }
  
  return distribution;
}

function buildAdaptivePrompt(content: any, type: 'chapter' | 'subject', config: AdaptiveQuizConfig, distribution: any): string {
  const { learnerProfile, questionCount, focusAreas } = config;
  
  let prompt = '';
  
  if (type === 'chapter') {
    prompt = `
Generate ${questionCount} adaptive quiz questions for this chapter based on learner profile:

Content:
Title: ${content.title}
Description: ${content.description}
Subject: ${content.subject?.name}

Lessons covered:
${content.lessons?.map((lesson: any) => `- ${lesson.title}: ${lesson.content?.substring(0, 200)}...`).join('\n')}

Learner Profile:
- Current Level: ${learnerProfile.currentLevel}
- Average Score: ${learnerProfile.averageScore}%
- Weak Areas: ${learnerProfile.weakAreas.join(', ') || 'None identified'}
- Strong Areas: ${learnerProfile.strongAreas.join(', ') || 'None identified'}
- Preferred Difficulty: ${learnerProfile.preferredDifficulty}

Difficulty Distribution Required:
- Easy: ${Math.round(distribution.easy * questionCount)} questions
- Medium: ${Math.round(distribution.medium * questionCount)} questions  
- Hard: ${Math.round(distribution.hard * questionCount)} questions

${focusAreas ? `Focus Areas: ${focusAreas.join(', ')}` : ''}

Requirements:
- Adapt questions to learner's current level and weak areas
- Create questions that challenge but don't overwhelm
- Multiple choice questions with 4 options each
- Include clear explanations for correct answers
- Focus on areas where learner needs improvement
- Questions should be in French (for Cameroon context)
- Include topic tags for each question

Return ONLY a JSON array of questions with this structure:
[
  {
    "question": "Question text in French",
    "type": "multiple-choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Correct option text",
    "explanation": "Explanation in French",
    "difficulty": "EASY|MEDIUM|HARD",
    "points": 1-3,
    "topic": "Specific topic/concept",
    "skillLevel": "BEGINNER|INTERMEDIATE|ADVANCED"
  }
]
`;
  } else {
    prompt = `
Generate ${questionCount} comprehensive adaptive quiz questions for this subject:

Subject: ${content.name}
Description: ${content.description}

Chapters covered:
${content.chapters?.map((chapter: any) => `- ${chapter.title}: ${chapter.description}`).join('\n')}

Learner Profile:
- Current Level: ${learnerProfile.currentLevel}
- Average Score: ${learnerProfile.averageScore}%
- Weak Areas: ${learnerProfile.weakAreas.join(', ') || 'None identified'}
- Strong Areas: ${learnerProfile.strongAreas.join(', ') || 'None identified'}
- Preferred Difficulty: ${learnerProfile.preferredDifficulty}

Difficulty Distribution Required:
- Easy: ${Math.round(distribution.easy * questionCount)} questions
- Medium: ${Math.round(distribution.medium * questionCount)} questions
- Hard: ${Math.round(distribution.hard * questionCount)} questions

${focusAreas ? `Focus Areas: ${focusAreas.join(', ')}` : ''}

Requirements:
- Create comprehensive questions covering all chapters
- Adapt to learner's profile and focus on weak areas
- Multiple choice questions with 4 options each
- Include clear explanations for correct answers
- Test both knowledge recall and application
- Questions should be in French (for Cameroon context)
- Cover key concepts from each chapter
- Include topic tags for tracking

Return ONLY a JSON array of questions with this structure:
[
  {
    "question": "Question text in French",
    "type": "multiple-choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Correct option text",
    "explanation": "Explanation in French",
    "difficulty": "EASY|MEDIUM|HARD",
    "points": 1-3,
    "topic": "Specific topic/concept",
    "skillLevel": "BEGINNER|INTERMEDIATE|ADVANCED"
  }
]
`;
  }
  
  return prompt;
}

function adaptQuestionsToLearner(questions: any[], profile: LearnerProfile): QuizQuestion[] {
  return questions.filter((q: any) => 
    q.question && q.options && q.correctAnswer && q.explanation
  ).map((q: any) => ({
    question: q.question,
    type: q.type || 'multiple-choice',
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: q.difficulty || 'MEDIUM',
    points: q.points || (q.difficulty === 'HARD' ? 3 : q.difficulty === 'EASY' ? 1 : 2),
    topic: q.topic || 'General',
    skillLevel: q.skillLevel || profile.currentLevel
  }));
}

function generateAdaptiveFallbackQuestions(content: any, type: 'chapter' | 'subject', config: AdaptiveQuizConfig): QuizQuestion[] {
  const { learnerProfile, questionCount } = config;
  
  const fallbackQuestions: QuizQuestion[] = [];
  
  // Generate questions based on learner level
  for (let i = 0; i < questionCount; i++) {
    const difficulty = i < questionCount * 0.3 ? 'EASY' : 
                     i < questionCount * 0.7 ? 'MEDIUM' : 'HARD';
    
    fallbackQuestions.push({
      question: `Question ${i + 1} sur ${content.title || content.name} (Niveau: ${difficulty})`,
      type: 'multiple-choice',
      options: [
        'Option A - Concept de base',
        'Option B - Application pratique', 
        'Option C - Analyse avancée',
        'Option D - Synthèse complète'
      ],
      correctAnswer: difficulty === 'EASY' ? 'Option A - Concept de base' : 
                    difficulty === 'MEDIUM' ? 'Option B - Application pratique' : 
                    'Option C - Analyse avancée',
      explanation: `Cette question teste votre compréhension au niveau ${difficulty.toLowerCase()}.`,
      difficulty,
      points: difficulty === 'HARD' ? 3 : difficulty === 'EASY' ? 1 : 2,
      topic: type === 'chapter' ? content.title : content.name,
      skillLevel: learnerProfile.currentLevel
    });
  }
  
  return fallbackQuestions;

}

// Legacy fallback function
function generateFallbackQuestions(content: any, type: 'chapter' | 'subject'): QuizQuestion[] {
  const defaultConfig: AdaptiveQuizConfig = {
    learnerProfile: {
      userId: 'default',
      currentLevel: 'INTERMEDIATE',
      weakAreas: [],
      strongAreas: [],
      averageScore: 70,
      recentPerformance: [70],
      preferredDifficulty: 'MEDIUM'
    },
    questionCount: 2,
    adaptToPerformance: false
  };
  
  return generateAdaptiveFallbackQuestions(content, type, defaultConfig);
}

// Helper functions for advanced analysis
function analyzeWeakAreaPatterns(weakAreas: any[]): Record<string, number> {
  const topicFrequency: Record<string, number> = {};
  
  weakAreas.forEach(area => {
    const topic = area.topic || 'General';
    topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
  });
  
  return topicFrequency;
}

function calculatePerformanceTrend(quizHistory: any[]): string {
  if (quizHistory.length < 2) return 'Insufficient data';
  
  const recentScores = quizHistory.slice(-3).map(quiz => 
    Math.round((quiz.score / quiz.maxScore) * 100)
  );
  
  const trend = recentScores[recentScores.length - 1] - recentScores[0];
  
  if (trend > 10) return 'Improving significantly';
  if (trend > 0) return 'Improving gradually';
  if (trend === 0) return 'Stable performance';
  if (trend > -10) return 'Declining slightly';
  return 'Declining significantly';
}

function enhanceSuggestionsWithAdaptiveLearning(
  suggestions: any, 
  learnerProfile: LearnerProfile, 
  weakAreas: any[]
): any {
  // Add personalized insights based on learner profile
  const enhancedSuggestions = { ...suggestions };
  
  // Adjust difficulty recommendations based on current level
  if (learnerProfile.currentLevel === 'BEGINNER') {
    enhancedSuggestions.nextQuizRecommendation = {
      ...enhancedSuggestions.nextQuizRecommendation,
      suggestedDifficulty: 'EASY',
      readinessScore: Math.max(60, learnerProfile.averageScore)
    };
  } else if (learnerProfile.currentLevel === 'ADVANCED') {
    enhancedSuggestions.nextQuizRecommendation = {
      ...enhancedSuggestions.nextQuizRecommendation,
      suggestedDifficulty: 'HARD',
      readinessScore: Math.min(90, learnerProfile.averageScore + 10)
    };
  }
  
  // Add specific focus areas based on weak patterns
  const topicFrequency = analyzeWeakAreaPatterns(weakAreas);
  const mostProblematicTopics = Object.entries(topicFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([topic]) => topic);
  
  enhancedSuggestions.nextQuizRecommendation.focusAreas = mostProblematicTopics;
  
  return enhancedSuggestions;
}

// Legacy function for backward compatibility
export async function generateStudySuggestions(weakAreas: any[], userPerformance: any) {
  const defaultProfile: LearnerProfile = {
    userId: 'default',
    currentLevel: 'INTERMEDIATE',
    weakAreas: [],
    strongAreas: [],
    averageScore: 70,
    recentPerformance: [70],
    preferredDifficulty: 'MEDIUM'
  };
  
  return generateAdvancedStudySuggestions(weakAreas, userPerformance, defaultProfile, []);
}

export async function generateAdvancedStudySuggestions(
  weakAreas: any[], 
  userPerformance: any, 
  learnerProfile: LearnerProfile,
  quizHistory: any[] = []
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Analyze patterns in weak areas
    const topicFrequency = analyzeWeakAreaPatterns(weakAreas);
    const performanceTrend = calculatePerformanceTrend(quizHistory);
    
    const prompt = `
Analyze this student's comprehensive learning profile and provide advanced personalized study suggestions:

Learner Profile:
- Current Level: ${learnerProfile.currentLevel}
- Average Score: ${learnerProfile.averageScore}%
- Known Weak Areas: ${learnerProfile.weakAreas.join(', ') || 'None identified'}
- Strong Areas: ${learnerProfile.strongAreas.join(', ') || 'None identified'}
- Recent Performance Trend: ${performanceTrend}

Current Quiz Performance:
- Score: ${userPerformance.score}/${userPerformance.maxScore} (${Math.round((userPerformance.score / userPerformance.maxScore) * 100)}%)
- Time Spent: ${userPerformance.timeSpent} minutes

Detailed Weak Areas Analysis:
${weakAreas.map(area => `- Question: ${area.question}\n  Topic: ${area.topic || 'General'}\n  User Answer: ${area.userAnswer}\n  Correct Answer: ${area.correctAnswer}\n  Difficulty: ${area.difficulty}\n  Skill Level: ${area.skillLevel || 'INTERMEDIATE'}`).join('\n\n')}

Topic Frequency Issues:
${Object.entries(topicFrequency).map(([topic, count]) => `- ${topic}: ${count} errors`).join('\n')}

Provide comprehensive suggestions in French for Cameroon students. Include:
1. Specific topics to review with priority levels
2. Adaptive study methods based on learning style
3. Practice suggestions with difficulty progression
4. Time management recommendations
5. Motivation and confidence building
6. Next steps for improvement

Return a JSON object with this structure:
{
  "overallFeedback": "Comprehensive feedback in French",
  "weaknessAnalysis": {
    "primaryWeaknesses": ["weakness1", "weakness2"],
    "secondaryWeaknesses": ["weakness3", "weakness4"],
    "improvementPotential": "HIGH|MEDIUM|LOW"
  },
  "adaptiveStudyPlan": [
    {
      "topic": "Topic name",
      "currentLevel": "BEGINNER|INTERMEDIATE|ADVANCED",
      "targetLevel": "BEGINNER|INTERMEDIATE|ADVANCED",
      "suggestion": "Specific adaptive study suggestion",
      "priority": "HIGH|MEDIUM|LOW",
      "estimatedTime": "Time in minutes",
      "resources": ["resource1", "resource2"]
    }
  ],
  "recommendedActions": [
    {
      "action": "Specific action",
      "timeline": "When to do it",
      "difficulty": "EASY|MEDIUM|HARD"
    }
  ],
  "progressMilestones": [
    {
      "milestone": "Achievement goal",
      "timeframe": "Expected timeframe",
      "measurable": "How to measure success"
    }
  ],
  "motivationalMessage": "Personalized encouraging message in French",
  "nextQuizRecommendation": {
    "suggestedDifficulty": "EASY|MEDIUM|HARD",
    "focusAreas": ["area1", "area2"],
    "readinessScore": "Percentage ready for next level"
  }
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      
      // Enhance suggestions with adaptive learning insights
      return enhanceSuggestionsWithAdaptiveLearning(suggestions, learnerProfile, weakAreas);
    }

    throw new Error('No valid JSON found in AI response');

  } catch (error) {
    console.error('AI Suggestions Generation Error:', error);
    
    // Enhanced fallback suggestions
    return {
      overallFeedback: "Continuez vos efforts! Concentrez-vous sur les domaines où vous avez eu des difficultés.",
      weaknessAnalysis: {
        primaryWeaknesses: weakAreas.slice(0, 2).map(area => area.topic || 'Concept général'),
        secondaryWeaknesses: weakAreas.slice(2, 4).map(area => area.topic || 'Concept général'),
        improvementPotential: learnerProfile.averageScore < 60 ? 'HIGH' : learnerProfile.averageScore > 80 ? 'LOW' : 'MEDIUM'
      },
      adaptiveStudyPlan: weakAreas.map(area => ({
        topic: area.topic || area.question.substring(0, 30) + '...',
        currentLevel: learnerProfile.currentLevel,
        targetLevel: learnerProfile.currentLevel === 'BEGINNER' ? 'INTERMEDIATE' : 
                    learnerProfile.currentLevel === 'INTERMEDIATE' ? 'ADVANCED' : 'ADVANCED',
        suggestion: "Révisez ce concept et pratiquez des exercices similaires.",
        priority: area.difficulty === 'HARD' ? 'HIGH' : 'MEDIUM',
        estimatedTime: area.difficulty === 'HARD' ? '45' : '30',
        resources: ["Leçons du chapitre", "Exercices pratiques"]
      })),
      recommendedActions: [
        {
          action: "Relisez les leçons concernées",
          timeline: "Dans les 24 heures",
          difficulty: "EASY"
        },
        {
          action: "Pratiquez plus d'exercices",
          timeline: "Cette semaine",
          difficulty: "MEDIUM"
        },
        {
          action: "Posez des questions sur le forum",
          timeline: "Quand nécessaire",
          difficulty: "EASY"
        }
      ],
      progressMilestones: [
        {
          milestone: "Améliorer le score de 10%",
          timeframe: "2 semaines",
          measurable: "Score supérieur à " + (userPerformance.score + 10) + "%"
        }
      ],
      motivationalMessage: "Chaque erreur est une opportunité d'apprendre. Continuez à progresser!",
      nextQuizRecommendation: {
        suggestedDifficulty: learnerProfile.preferredDifficulty,
        focusAreas: weakAreas.slice(0, 3).map(area => area.topic || 'Général'),
        readinessScore: Math.min(85, learnerProfile.averageScore + 5).toString() + "%"
      }
    };
  }
}

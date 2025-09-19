import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_AI_API_KEY;
const MODEL_NAME = process.env.GOOGLE_AI_MODEL || "gemini-1.5-flash";

if (!API_KEY) {
  console.warn("Google AI API key not found. AI features will be disabled.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export class GoogleAIService {
  private model: any;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: MODEL_NAME });
    }
  }

  async generateText(prompt: string): Promise<AIResponse> {
    if (!this.model) {
      return {
        success: false,
        error:
          "Google AI service not initialized. Check API key configuration.",
      };
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        content: text,
      };
    } catch (error) {
      console.error("Google AI API Error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown AI service error",
      };
    }
  }

  // Generate adaptive assessment questions based on user performance
  async generateAdaptiveQuestions(
    examType: string,
    difficulty: string,
    weakAreas: string[],
    count: number = 10,
  ): Promise<AIResponse> {
    const prompt = `
Generate ${count} multiple-choice questions for ${examType} exam preparation.
Difficulty level: ${difficulty}
Focus on these weak areas: ${weakAreas.join(", ")}

For each question, provide:
1. Question text
2. 4 multiple choice options 
3. Correct answer (full option text, not just letter)
4. Brief explanation of the correct answer
5. Difficulty level (EASY, MEDIUM, HARD)

Format as JSON array:
[
  {
    "question": "Question text here",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": "Option A text",
    "explanation": "Detailed explanation here",
    "difficulty": "MEDIUM"
  }
]

Ensure questions are varied, challenging, and directly relevant to ${examType} exam content.
Include mathematics, logic, general knowledge, and subject-specific topics.
Make sure each question tests different concepts and skills.
`;

    return this.generateText(prompt);
  }

  // Generate personalized learning path recommendations
  async generateLearningPath(
    userProfile: any,
    examType: string,
    weakAreas: string[],
    availableHours: number,
  ): Promise<AIResponse> {
    const prompt = `
Create a personalized learning path for a student preparing for ${examType} exam.

Student Profile:
- Current Level: ${userProfile.currentLevel}
- Available Study Hours per Day: ${availableHours}
- Weak Areas: ${weakAreas.join(", ")}
- Learning Goals: ${userProfile.learningGoals || "Pass the exam"}

Generate a structured study plan with:
1. Recommended study sequence (prioritize weak areas)
2. Daily time allocation
3. Milestones and checkpoints
4. Study tips specific to ${examType}

Format as JSON:
{
  "studyPlan": {
    "totalDuration": "X weeks",
    "dailyHours": ${availableHours},
    "phases": [
      {
        "phase": "Foundation Building",
        "duration": "2 weeks",
        "topics": ["topic1", "topic2"],
        "goals": "Build strong fundamentals"
      }
    ],
    "recommendations": ["tip1", "tip2"],
    "milestones": ["milestone1", "milestone2"]
  }
}
`;

    return this.generateText(prompt);
  }

  // Analyze user performance and provide insights
  async analyzePerformance(
    assessmentResults: any[],
    studyTime: number,
  ): Promise<AIResponse> {
    const averageScore =
      assessmentResults.reduce((sum, result) => sum + result.score, 0) /
      assessmentResults.length;
    const recentTrend = assessmentResults.slice(-5).map((r) => r.score);

    const prompt = `
Analyze this student's learning performance and provide insights:

Performance Data:
- Average Score: ${averageScore.toFixed(1)}%
- Recent Scores: ${recentTrend.join(", ")}%
- Total Study Time: ${studyTime} minutes
- Number of Assessments: ${assessmentResults.length}

Provide analysis in JSON format:
{
  "overallPerformance": "excellent|good|average|needs_improvement",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "studyStrategy": "Specific strategy based on performance",
  "motivationalMessage": "Encouraging message for the student"
}

Focus on actionable insights and specific study strategies.
`;

    return this.generateText(prompt);
  }

  // Generate study reminders and motivational content
  async generateStudyReminder(
    userProgress: any,
    streakDays: number,
  ): Promise<AIResponse> {
    const prompt = `
Generate a personalized study reminder message for a student with:
- Current Progress: ${userProgress.completedCourses || 0} courses completed
- Study Streak: ${streakDays} days
- Recent Activity: ${userProgress.recentActivity || "moderate"}

Create an encouraging, personalized message that:
1. Acknowledges their progress
2. Motivates continued learning
3. Suggests next steps
4. Keeps it brief and positive

Return just the message text, no JSON formatting.
`;

    return this.generateText(prompt);
  }

  // Generate AI-powered study recommendations
  async generateStudyRecommendations(
    userProfile: any,
    recentPerformance: any[],
    availableTime: number
  ): Promise<AIResponse> {
    const prompt = `
Based on this student's profile and recent performance, generate personalized study recommendations:

Student Profile:
- Current Level: ${userProfile.level || "Beginner"}
- Subjects: ${userProfile.subjects?.join(", ") || "General"}
- Learning Style: ${userProfile.learningStyle || "Visual"}
- Available Study Time: ${availableTime} minutes/day

Recent Performance:
${recentPerformance.map(p => `- ${p.subject}: ${p.score}% (${p.date})`).join("\n")}

Generate recommendations in JSON format:
{
  "priorityTopics": ["topic1", "topic2", "topic3"],
  "studyMethods": ["method1", "method2"],
  "timeAllocation": {
    "review": "30%",
    "newContent": "50%", 
    "practice": "20%"
  },
  "weeklyGoals": ["goal1", "goal2"],
  "motivationalTip": "Encouraging message"
}
`;

    return this.generateText(prompt);
  }

  // Generate AI explanations for incorrect answers
  async generateAnswerExplanation(
    question: string,
    userAnswer: string,
    correctAnswer: string,
    subject: string
  ): Promise<AIResponse> {
    const prompt = `
Explain why the student's answer is incorrect and help them understand the correct solution:

Subject: ${subject}
Question: ${question}
Student's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Provide a clear, educational explanation that:
1. Explains why the student's answer is wrong
2. Shows the correct reasoning step-by-step
3. Gives tips to avoid similar mistakes
4. Uses simple, encouraging language

Return just the explanation text.
`;

    return this.generateText(prompt);
  }

  // Generate personalized lesson content
  async generateLessonContent(
    topic: string,
    difficulty: string,
    learningStyle: string,
    duration: number
  ): Promise<AIResponse> {
    const prompt = `
Create a personalized lesson on "${topic}" for a ${difficulty} level student with ${learningStyle} learning style.
Lesson should be ${duration} minutes long.

Include:
1. Learning objectives
2. Key concepts with clear explanations
3. Real-world examples
4. Interactive elements for ${learningStyle} learners
5. Practice questions
6. Summary points

Format as structured markdown with clear sections.
Make it engaging and appropriate for the student's level.
`;

    return this.generateText(prompt);
  }

  // Generate AI chatbot responses
  async generateChatbotResponse(
    userMessage: string,
    context: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    const prompt = `
You are an AI learning assistant for Mindboost platform. Respond to the student's message helpfully and encouragingly.

Student Message: "${userMessage}"

Context:
- Current Course: ${context.currentCourse || "None"}
- Recent Performance: ${context.recentScore || "N/A"}%
- Study Streak: ${context.studyStreak || 0} days

Previous Conversation:
${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join("\n")}

Provide a helpful, encouraging response that:
1. Addresses their specific question
2. Offers study tips if relevant
3. Motivates continued learning
4. Keeps it conversational and supportive

Return just the response text.
`;

    return this.generateText(prompt);
  }

  // Generate performance insights and analytics
  async generatePerformanceInsights(
    studentData: any,
    timeframe: string
  ): Promise<AIResponse> {
    const prompt = `
Analyze this student's performance over the ${timeframe} and provide insights:

Performance Data:
- Average Score: ${studentData.averageScore}%
- Completed Lessons: ${studentData.completedLessons}
- Study Time: ${studentData.studyTime} hours
- Strong Subjects: ${studentData.strongSubjects?.join(", ") || "None"}
- Weak Subjects: ${studentData.weakSubjects?.join(", ") || "None"}
- Quiz Attempts: ${studentData.quizAttempts}
- Improvement Trend: ${studentData.trend || "Stable"}

Generate insights in JSON format:
{
  "overallAssessment": "Detailed assessment of progress",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "nextSteps": ["step1", "step2"],
  "motivationalMessage": "Encouraging message",
  "predictedOutcome": "Prediction based on current trajectory"
}
`;

    return this.generateText(prompt);
  }

  // Generate course content suggestions
  async generateCourseContent(
    examType: string,
    topic: string,
    level: string,
  ): Promise<AIResponse> {
    const prompt = `
Generate educational content for ${examType} exam preparation.

Topic: ${topic}
Level: ${level}

Create structured lesson content including:
1. Learning objectives
2. Key concepts explanation
3. Practical examples
4. Practice problems
5. Summary points

Format as markdown for easy reading. Focus on clarity and exam relevance.
Make it concise but comprehensive, suitable for ${level} level students.
`;

    return this.generateText(prompt);
  }
}

// Export singleton instance
export const googleAI = new GoogleAIService();

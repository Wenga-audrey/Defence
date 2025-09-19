import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Zap,
  RefreshCw,
  CheckCircle
} from '@/lib/icons';

interface StudyRecommendations {
  priorityTopics: string[];
  studyMethods: string[];
  timeAllocation: {
    review: string;
    newContent: string;
    practice: string;
  };
  weeklyGoals: string[];
  motivationalTip: string;
}

interface AIRecommendationsProps {
  className?: string;
}

export default function AIRecommendations({ className = '' }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<StudyRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          availableTime: 60 // Default 60 minutes per day
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
        setLastUpdated(new Date());
      } else {
        // Use fallback data
        setRecommendations(data.fallback || {
          priorityTopics: ["Review fundamentals", "Practice problem solving"],
          studyMethods: ["Active recall", "Spaced repetition"],
          timeAllocation: { review: "30%", newContent: "50%", practice: "20%" },
          weeklyGoals: ["Complete 3 practice quizzes", "Review 2 challenging topics"],
          motivationalTip: "Consistent daily practice leads to mastery!"
        });
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch AI recommendations:', error);
      // Fallback recommendations
      setRecommendations({
        priorityTopics: ["Review fundamentals", "Practice regularly"],
        studyMethods: ["Active learning", "Regular testing"],
        timeAllocation: { review: "30%", newContent: "50%", practice: "20%" },
        weeklyGoals: ["Stay consistent", "Track progress"],
        motivationalTip: "Every step forward is progress!"
      });
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (!recommendations && !isLoading) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-mindboost-green" />
          <h3 className="font-semibold">AI Study Recommendations</h3>
          <Badge variant="secondary" className="bg-mindboost-green/10 text-mindboost-green">
            Personalized
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendations ? (
          <>
            {/* Priority Topics */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-4 w-4 text-orange-500" />
                <h4 className="font-medium">Priority Topics</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendations.priorityTopics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Study Methods */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium">Recommended Methods</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendations.studyMethods.map((method, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Time Allocation */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-green-500" />
                <h4 className="font-medium">Time Allocation</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-700">
                    {recommendations.timeAllocation.review}
                  </div>
                  <div className="text-sm text-green-600">Review</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-700">
                    {recommendations.timeAllocation.newContent}
                  </div>
                  <div className="text-sm text-blue-600">New Content</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-semibold text-purple-700">
                    {recommendations.timeAllocation.practice}
                  </div>
                  <div className="text-sm text-purple-600">Practice</div>
                </div>
              </div>
            </div>

            {/* Weekly Goals */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-4 w-4 text-mindboost-green" />
                <h4 className="font-medium">This Week's Goals</h4>
              </div>
              <ul className="space-y-2">
                {recommendations.weeklyGoals.map((goal, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-mindboost-green rounded-full"></div>
                    <span className="text-sm text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Motivational Tip */}
            <div className="bg-gradient-to-r from-mindboost-green/10 to-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Zap className="h-4 w-4 text-mindboost-green mt-0.5" />
                <div>
                  <h4 className="font-medium text-mindboost-green mb-1">AI Tip</h4>
                  <p className="text-sm text-gray-700">{recommendations.motivationalTip}</p>
                </div>
              </div>
            </div>

            {lastUpdated && (
              <div className="text-xs text-gray-500 text-center">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

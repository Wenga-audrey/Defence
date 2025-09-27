@@ .. @@
-import React, { useState, useEffect } from 'react';
+import React, { useState, useEffect } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { api } from '@shared/api';
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

-interface StudyRecommendations {
-  priorityTopics: string[];
-  studyMethods: string[];
-  timeAllocation: {
-    review: string;
-    newContent: string;
-    practice: string;
-  };
-  weeklyGoals: string[];
-  motivationalTip: string;
-}
-
-interface AIRecommendationsProps {
-  className?: string;
-}
-
-export default function AIRecommendations({ className = '' }: AIRecommendationsProps) {
-  const [recommendations, setRecommendations] = useState<StudyRecommendations | null>(null);
+export default function AIRecommendations({ className = '' }) {
+  const [recommendations, setRecommendations] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
-  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
+  const [lastUpdated, setLastUpdated] = useState(null);

   const fetchRecommendations = async () => {
     setIsLoading(true);
     try {
-      const res = await api.post<any>(`/api/ai/recommendations`, { availableTime: 60 });
+      const res = await api.post(`/api/ai/recommendations`, { availableTime: 60 });
       if (res.success && res.data) {
         // Backend returns either { recommendations } or directly the data
-        const payload: any = res.data as any;
+        const payload = res.data;
         const recos = payload.recommendations || payload;
         setRecommendations(recos);
         setLastUpdated(new Date());
       } else {
         // Use fallback data
         setRecommendations({
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
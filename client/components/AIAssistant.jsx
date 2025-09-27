@@ .. @@
-import React, { useState, useRef, useEffect } from 'react';
+import React, { useState, useRef, useEffect } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import {
   MessageCircle,
   Send,
   Bot,
   User,
   X,
   Minimize2,
   Maximize2,
   Lightbulb,
   TrendingUp,
   BookOpen,
   Target
 } from '@/lib/icons';

-interface Message {
-  id: string;
-  role: 'user' | 'assistant';
-  content: string;
-  timestamp: Date;
-}
-
-interface AIAssistantProps {
-  isOpen: boolean;
-  onToggle: () => void;
-}
-
-export default function AIAssistant({ isOpen, onToggle }: AIAssistantProps) {
-  const [messages, setMessages] = useState<Message[]>([
+export default function AIAssistant({ isOpen, onToggle }) {
+  const [messages, setMessages] = useState([
     {
       id: '1',
       role: 'assistant',
       content: 'Hi! I\'m your AI study assistant. I can help you with study recommendations, explain difficult concepts, or answer questions about your learning progress. How can I help you today?',
       timestamp: new Date()
     }
   ]);
   const [inputMessage, setInputMessage] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isMinimized, setIsMinimized] = useState(false);
-  const messagesEndRef = useRef<HTMLDivElement>(null);
+  const messagesEndRef = useRef(null);

   const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
     scrollToBottom();
   }, [messages]);

   const sendMessage = async () => {
     if (!inputMessage.trim() || isLoading) return;

-    const userMessage: Message = {
+    const userMessage = {
       id: Date.now().toString(),
       role: 'user',
       content: inputMessage,
       timestamp: new Date()
     };

     setMessages(prev => [...prev, userMessage]);
     setInputMessage('');
     setIsLoading(true);

     try {
       const token = localStorage.getItem('token');
       const response = await fetch('http://localhost:3001/api/ai/chat', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           ...(token && { 'Authorization': `Bearer ${token}` })
         },
         body: JSON.stringify({
           message: inputMessage,
           conversationHistory: messages.slice(-5)
         })
       });

       const data = await response.json();

       if (response.ok && (data.success || data.response)) {
-        const assistantMessage: Message = {
+        const assistantMessage = {
           id: (Date.now() + 1).toString(),
           role: 'assistant',
           content: data.response || data.message,
           timestamp: new Date()
         };
         setMessages(prev => [...prev, assistantMessage]);
       } else {
         throw new Error('Failed to get AI response');
       }
     } catch (error) {
       console.error('AI Chat Error:', error);
       
       // Provide helpful fallback responses
       const fallbackResponses = [
         "I'm here to help with your studies! What subject would you like to focus on?",
         "Let me assist you with your learning. What topic are you working on?",
         "I can help with math, physics, chemistry, biology, and more. What would you like to study?",
         "I'm your AI study assistant. Feel free to ask me about any academic topic!"
       ];
       
       const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
       
-      const errorMessage: Message = {
+      const errorMessage = {
         id: (Date.now() + 1).toString(),
         role: 'assistant',
         content: randomResponse,
         timestamp: new Date()
       };
       setMessages(prev => [...prev, errorMessage]);
     } finally {
       setIsLoading(false);
     }
   };

-  const handleKeyPress = (e: React.KeyboardEvent) => {
+  const handleKeyPress = (e) => {
     if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault();
       sendMessage();
     }
   };

   const quickActions = [
     { icon: Lightbulb, text: 'Study Tips', message: 'Give me some study tips for better learning' },
     { icon: TrendingUp, text: 'Progress', message: 'How am I doing with my studies?' },
     { icon: BookOpen, text: 'Explain', message: 'Can you explain a difficult concept?' },
     { icon: Target, text: 'Goals', message: 'Help me set study goals' }
   ];

-  const handleQuickAction = (message: string) => {
+  const handleQuickAction = (message) => {
     setInputMessage(message);
   };
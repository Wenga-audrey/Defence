import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  BookOpen, Clock, Trophy, Users, Star, ArrowRight, Download, Bell, FileText, Brain, 
  User, MessageCircle, Search, Calendar as CalendarIcon, Sparkles, 
  Bookmark, Award, BarChart3, Lightbulb, Zap, CheckCircle,
  Bookmark as BookMarked, Settings, LogOut, ChevronRight
} from '@/lib/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface EnrolledClass {
  id: string;
  name: string;
  progress: number;
  subjects: Subject[];
  lastAccessed?: LastAccessed;
}

interface Subject {
  id: string;
  name: string;
  progress: number;
  chapters: Chapter[];
}

interface Quiz {
  id: string;
  title: string;
  chapterId: string;
  isCompleted: boolean;
  score?: number;
  dueDate?: string;
}

interface Chapter {
  id: string;
  title: string;
  progress: number;
  lessons: Lesson[];
  quizzes: Quiz[];
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  pdfUrl?: string;
  isCompleted?: boolean;
  lastAccessedAt?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quiz' | 'announcement' | 'grade' | 'reminder' | 'achievement';
  timestamp: string;
  isRead: boolean;
}

interface LastAccessed {
  type: 'lesson' | 'quiz';
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  timestamp: string;
}

interface StudyGroup {
  id: string;
  name: string;
  members: number;
  nextSession?: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subjectId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ScheduledTask {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: 'study' | 'quiz' | 'exam' | 'meeting';
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
}

const LearnerDashboard: React.FC = () => {
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Marie Ngozi');
  const [userEmail, setUserEmail] = useState('marie.ngozi@example.com');
  const [enrolledClassName, setEnrolledClassName] = useState('ENS Yaoundé');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lastAccessed, setLastAccessed] = useState<LastAccessed | null>(null);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for enrolled classes
        const mockData: EnrolledClass[] = [
          {
            id: 'ens-lettres-2024',
            name: 'ENS - Sciences',
            progress: 65,
            lastAccessed: {
              type: 'lesson',
              id: 'physics-lesson-1',
              title: 'Newton\'s Laws',
              subjectId: 'physics',
              subjectName: 'Physics',
              chapterId: 'physics-chapter-1',
              chapterTitle: 'Mechanics',
              timestamp: '2 hours ago'
            },
            subjects: [
              {
                id: 'mathematics',
                name: 'Mathematics',
                progress: 45,
                chapters: [
                  {
                    id: 'math-chapter-1',
                    title: 'Algebra and Equations',
                    progress: 30,
                    lessons: [
                      { 
                        id: 'math-lesson-1', 
                        title: 'Linear Equations', 
                        duration: 60, 
                        pdfUrl: '/pdfs/math-algebra.pdf',
                        isCompleted: false
                      },
                      { 
                        id: 'math-lesson-2', 
                        title: 'Quadratic Equations', 
                        duration: 45, 
                        isCompleted: false
                      },
                    ],
                    quizzes: [
                      { 
                        id: 'math-quiz-1', 
                        title: 'Algebra Quiz', 
                        chapterId: 'math-chapter-1', 
                        isCompleted: false,
                        dueDate: '2025-10-05'
                      },
                    ],
                  },
                ],
              },
              {
                id: 'physics',
                name: 'Physics',
                progress: 70,
                chapters: [
                  {
                    id: 'physics-chapter-1',
                    title: 'Mechanics',
                    progress: 80,
                    lessons: [
                      { 
                        id: 'physics-lesson-1', 
                        title: 'Newton\'s Laws', 
                        duration: 75, 
                        pdfUrl: '/pdfs/physics-mechanics.pdf',
                        isCompleted: true,
                        lastAccessedAt: '2 hours ago'
                      },
                    ],
                    quizzes: [
                      { 
                        id: 'physics-quiz-1', 
                        title: 'Mechanics Quiz', 
                        chapterId: 'physics-chapter-1', 
                        isCompleted: true, 
                        score: 85 
                      },
                    ],
                  },
                ],
              },
              {
                id: 'chemistry',
                name: 'Chemistry',
                progress: 55,
                chapters: [
                  {
                    id: 'chemistry-chapter-1',
                    title: 'Organic Chemistry',
                    progress: 55,
                    lessons: [
                      { 
                        id: 'chemistry-lesson-1', 
                        title: 'Hydrocarbons', 
                        duration: 90, 
                        pdfUrl: '/pdfs/chemistry-organic.pdf',
                        isCompleted: true
                      },
                    ],
                    quizzes: [
                      { 
                        id: 'chemistry-quiz-1', 
                        title: 'Organic Chemistry Quiz', 
                        chapterId: 'chemistry-chapter-1', 
                        isCompleted: false,
                        dueDate: '2025-09-30'
                      },
                    ],
                  },
                ],
              },
              {
                id: 'biology',
                name: 'Biology',
                progress: 90,
                chapters: [
                  {
                    id: 'biology-chapter-1',
                    title: 'Cell Biology',
                    progress: 90,
                    lessons: [
                      { 
                        id: 'biology-lesson-1', 
                        title: 'Cell Structure', 
                        duration: 60, 
                        pdfUrl: '/pdfs/biology-cells.pdf',
                        isCompleted: true
                      },
                    ],
                    quizzes: [
                      { 
                        id: 'biology-quiz-1', 
                        title: 'Cell Biology Quiz', 
                        chapterId: 'biology-chapter-1', 
                        isCompleted: true, 
                        score: 90 
                      },
                    ],
                  },
                ],
              },
              {
                id: 'literature',
                name: 'Literature',
                progress: 20,
                chapters: [
                  {
                    id: 'lit-chapter-1',
                    title: 'French Poetry',
                    progress: 20,
                    lessons: [
                      { 
                        id: 'lit-lesson-1', 
                        title: 'Romanticism', 
                        duration: 60, 
                        pdfUrl: '/pdfs/literature-poetry.pdf',
                        isCompleted: false
                      },
                    ],
                    quizzes: [
                      { 
                        id: 'lit-quiz-1', 
                        title: 'Poetry Quiz', 
                        chapterId: 'lit-chapter-1', 
                        isCompleted: false,
                        dueDate: '2025-10-10'
                      },
                    ],
                  },
                ],
              },
              {
                id: 'philosophy',
                name: 'Philosophy',
                progress: 78,
                chapters: [
                  {
                    id: 'philosophy-chapter-1',
                    title: 'Ethics',
                    progress: 78,
                    lessons: [
                      { 
                        id: 'philosophy-lesson-1', 
                        title: 'Moral Philosophy', 
                        duration: 75, 
                        pdfUrl: '/pdfs/philosophy-ethics.pdf',
                        isCompleted: true
                      },
                    ],
                    quizzes: [
                      { 
                        id: 'philosophy-quiz-1', 
                        title: 'Ethics Quiz', 
                        chapterId: 'philosophy-chapter-1', 
                        isCompleted: true, 
                        score: 78 
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];

        // Mock notifications
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'New Quiz Available',
            message: 'A new quiz on "Le romantisme en poésie" is available for your ENS class.',
            type: 'quiz',
            timestamp: '2 hours ago',
            isRead: false
          },
          {
            id: '2',
            title: 'Grade Received',
            message: 'Your quiz on "Le réalisme dans le roman" has been graded.',
            type: 'grade',
            timestamp: '1 day ago',
            isRead: true
          },
          {
            id: '3',
            title: 'Study Reminder',
            message: 'Don\'t forget to review your Chemistry notes before tomorrow\'s quiz!',
            type: 'reminder',
            timestamp: '3 hours ago',
            isRead: false
          },
          {
            id: '4',
            title: 'Achievement Unlocked',
            message: 'Congratulations! You\'ve earned the "Consistent Learner" badge.',
            type: 'achievement',
            timestamp: '2 days ago',
            isRead: true
          },
        ];

        // Mock study groups
        const mockStudyGroups: StudyGroup[] = [
          {
            id: 'group-1',
            name: 'Physics Study Group',
            members: 8,
            nextSession: 'Tomorrow, 4:00 PM'
          },
          {
            id: 'group-2',
            name: 'Chemistry Prep Team',
            members: 5,
            nextSession: 'Friday, 2:30 PM'
          },
          {
            id: 'group-3',
            name: 'Literature Discussion',
            members: 12
          }
        ];

        // Mock flashcards
        const mockFlashcards: Flashcard[] = [
          {
            id: 'flash-1',
            question: 'What is Newton\'s First Law?',
            answer: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.',
            subjectId: 'physics',
            difficulty: 'medium'
          },
          {
            id: 'flash-2',
            question: 'What is the chemical formula for water?',
            answer: 'H₂O',
            subjectId: 'chemistry',
            difficulty: 'easy'
          },
          {
            id: 'flash-3',
            question: 'Who wrote "Les Misérables"?',
            answer: 'Victor Hugo',
            subjectId: 'literature',
            difficulty: 'easy'
          },
          {
            id: 'flash-4',
            question: 'What is the Pythagorean theorem?',
            answer: 'In a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides (a² + b² = c²).',
            subjectId: 'mathematics',
            difficulty: 'medium'
          }
        ];

        // Mock scheduled tasks
        const mockScheduledTasks: ScheduledTask[] = [
          {
            id: 'task-1',
            title: 'Chemistry Quiz',
            date: new Date(2025, 8, 30), // September 30, 2025
            completed: false,
            type: 'quiz'
          },
          {
            id: 'task-2',
            title: 'Physics Study Session',
            date: new Date(2025, 8, 25), // September 25, 2025
            completed: false,
            type: 'study'
          },
          {
            id: 'task-3',
            title: 'Literature Group Meeting',
            date: new Date(2025, 8, 28), // September 28, 2025
            completed: false,
            type: 'meeting'
          },
          {
            id: 'task-4',
            title: 'Mock Exam - Mathematics',
            date: new Date(2025, 9, 5), // October 5, 2025
            completed: false,
            type: 'exam'
          }
        ];

        // Mock leaderboard
        const mockLeaderboard: LeaderboardEntry[] = [
          {
            id: 'user-1',
            name: 'Jean Dupont',
            points: 1250,
            rank: 1
          },
          {
            id: 'user-2',
            name: 'Marie Ngozi',
            avatar: '/avatars/marie.jpg',
            points: 1180,
            rank: 2
          },
          {
            id: 'user-3',
            name: 'Ahmed Koné',
            points: 1050,
            rank: 3
          },
          {
            id: 'user-4',
            name: 'Sophie Mbala',
            points: 980,
            rank: 4
          },
          {
            id: 'user-5',
            name: 'Pierre Kamga',
            points: 920,
            rank: 5
          }
        ];

        setEnrolledClasses(mockData);
        setNotifications(mockNotifications);
        setLastAccessed(mockData[0].lastAccessed || null);
        setStudyGroups(mockStudyGroups);
        setFlashcards(mockFlashcards);
        setScheduledTasks(mockScheduledTasks);
        setLeaderboard(mockLeaderboard);
        setUnreadNotifications(mockNotifications.filter(n => !n.isRead).length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Apply dark mode if user preference exists
    const userPrefersDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(userPrefersDark);
    if (userPrefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  // Navigation handlers
  const handleViewForums = () => navigate('/forums');
  const handleViewProfile = () => navigate('/profile');
  const handleGoToHome = () => navigate('/');
  const handleViewSubject = (subjectId: string) => navigate(`/subject/${subjectId}`);
  const handleViewLesson = (lessonId: string) => navigate(`/lesson/${lessonId}`);
  const handleTakeQuiz = (quizId: string) => navigate(`/quiz/${quizId}`);
  const handleViewStudyGroup = (groupId: string) => navigate(`/study-groups/${groupId}`);
  const handleViewCalendar = () => navigate('/study-calendar');
  const handleViewAchievements = () => navigate('/achievements');

  // Flashcard handlers
  const nextFlashcard = () => {
    setShowFlashcardAnswer(false);
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length);
  };

  const prevFlashcard = () => {
    setShowFlashcardAnswer(false);
    setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleFlashcardAnswer = () => {
    setShowFlashcardAnswer(!showFlashcardAnswer);
  };

  // Task handlers
  const toggleTaskCompletion = (taskId: string) => {
    setScheduledTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Notification handlers
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadNotifications(0);
  };

  // Search functionality
  const filteredContent = () => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    
    const matchedSubjects = enrolledClasses.flatMap(cls => 
      cls.subjects.filter(subject => 
        subject.name.toLowerCase().includes(query)
      )
    );
    
    const matchedLessons = enrolledClasses.flatMap(cls => 
      cls.subjects.flatMap(subject => 
        subject.chapters.flatMap(chapter => 
          chapter.lessons.filter(lesson => 
            lesson.title.toLowerCase().includes(query)
          )
        )
      )
    );
    
    const matchedQuizzes = enrolledClasses.flatMap(cls => 
      cls.subjects.flatMap(subject => 
        subject.chapters.flatMap(chapter => 
          chapter.quizzes.filter(quiz => 
            quiz.title.toLowerCase().includes(query)
          )
        )
      )
    );
    
    return { matchedSubjects, matchedLessons, matchedQuizzes };
  };

  const searchResults = filteredContent();

  // Get tasks for selected date
  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return scheduledTasks.filter(task => 
      task.date.getDate() === selectedDate.getDate() &&
      task.date.getMonth() === selectedDate.getMonth() &&
      task.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const tasksForSelectedDate = getTasksForSelectedDate();


  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="w-64 bg-green-100 dark:bg-green-900 p-4 border-r dark:border-green-800 flex flex-col">
        <div className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start text-lg font-bold dark:text-white" onClick={handleGoToHome}>
            <Brain className="mr-2 h-5 w-5" />
            MindBoost
          </Button>
          
          <div className="pt-4">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">LEARNING</div>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/dashboard/learner')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/quizzes')}>
              <Brain className="mr-2 h-4 w-4" />
              Quizzes
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/exercises')}>
              <FileText className="mr-2 h-4 w-4" />
              Revision Exercises
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/past-papers')}>
              <BookOpen className="mr-2 h-4 w-4" />
              Past Papers
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={handleViewCalendar}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Study Calendar
            </Button>
          </div>
          
          <div className="pt-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">COMMUNITY</div>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={handleViewForums}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Forums
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/study-groups')}>
              <Users className="mr-2 h-4 w-4" />
              Study Groups
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={handleViewAchievements}>
              <Trophy className="mr-2 h-4 w-4" />
              Achievements
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t dark:border-green-800">
          <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={handleViewProfile}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/help')}>
            <Settings className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          <Button variant="ghost" className="w-full justify-start dark:text-gray-200" onClick={() => navigate('/signin')}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-white">
              Welcome back <span className="text-green-600 dark:text-green-400">Marie</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{userName}</p>
            <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
            <p className="text-green-600 dark:text-green-400 font-semibold">{enrolledClassName}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              
              {searchResults && (
                <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700 max-h-96 overflow-y-auto">
                  {searchResults.matchedSubjects.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Subjects</h3>
                      {searchResults.matchedSubjects.map(subject => (
                        <div 
                          key={subject.id} 
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => handleViewSubject(subject.id)}
                        >
                          <p className="font-medium dark:text-white">{subject.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.matchedLessons.length > 0 && (
                    <div className="p-2 border-t dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Lessons</h3>
                      {searchResults.matchedLessons.map(lesson => (
                        <div 
                          key={lesson.id} 
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => handleViewLesson(lesson.id)}
                        >
                          <p className="font-medium dark:text-white">{lesson.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration} minutes</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.matchedQuizzes.length > 0 && (
                    <div className="p-2 border-t dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Quizzes</h3>
                      {searchResults.matchedQuizzes.map(quiz => (
                        <div 
                          key={quiz.id} 
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => handleTakeQuiz(quiz.id)}
                        >
                          <p className="font-medium dark:text-white">{quiz.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {quiz.isCompleted ? `Completed (Score: ${quiz.score}%)` : 'Not completed'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.matchedSubjects.length === 0 && 
                   searchResults.matchedLessons.length === 0 && 
                   searchResults.matchedQuizzes.length === 0 && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative dark:bg-gray-800 dark:text-white dark:border-gray-700">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                  <h3 className="font-semibold dark:text-white">Notifications</h3>
                  <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b dark:border-gray-700 ${!notification.isRead ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium dark:text-white">{notification.title}</h4>
                          <Badge variant={notification.type === 'quiz' ? 'default' : 'secondary'}>
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/notifications')}>
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
              <Label htmlFor="dark-mode" className="sr-only">Dark Mode</Label>
              {isDarkMode ? (
                <Star className="h-5 w-5 text-gray-400" />
              ) : (
                <Star className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            
            <Avatar className="h-10 w-10 cursor-pointer" onClick={handleViewProfile}>
              <AvatarImage src="/avatars/marie.jpg" alt={userName} />
              <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Continue Learning Section */}
        {lastAccessed && (
          <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <Bookmark className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                Continue Learning
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg dark:text-white">{lastAccessed.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lastAccessed.subjectName} &gt; {lastAccessed.chapterTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Last accessed: {lastAccessed.timestamp}</p>
                </div>
                <Button onClick={() => 
                  lastAccessed.type === 'lesson' 
                    ? handleViewLesson(lastAccessed.id) 
                    : handleTakeQuiz(lastAccessed.id)
                }>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enrolledClasses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45h</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Groups</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Personalized suggestions based on your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledClasses.flatMap((cls) =>
                    cls.subjects.flatMap((subject) =>
                      subject.chapters.flatMap((chapter) =>
                        chapter.quizzes.filter((quiz) => !quiz.isCompleted || (quiz.score && quiz.score < 70)).map((quiz) => (
                          <div key={quiz.id} className="p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold dark:text-white">Improve in {subject.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {quiz.isCompleted ? `Retake ${quiz.title} (Score: ${quiz.score}%)` : `Complete ${quiz.title} for ${chapter.title}`}
                            </p>
                            {quiz.dueDate && (
                              <p className="text-xs text-red-500 mt-1">Due: {quiz.dueDate}</p>
                            )}
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => handleTakeQuiz(quiz.id)}>
                              {quiz.isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                            </Button>
                          </div>
                        ))
                      )
                    )
                  ).slice(0, 2)}
                  {enrolledClasses.flatMap((cls) =>
                    cls.subjects.flatMap((subject) =>
                      subject.chapters.flatMap((chapter) =>
                        chapter.lessons.filter(lesson => !lesson.isCompleted).map((lesson) => (
                          <div key={lesson.id} className="p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold dark:text-white">Study {subject.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Review {lesson.title} to improve understanding.</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => handleViewLesson(lesson.id)}>
                              Start Lesson
                            </Button>
                          </div>
                        ))
                      )
                    )
                  ).slice(0, 1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {enrolledClasses.flatMap((cls) =>
                    cls.subjects.flatMap((subject) =>
                      subject.chapters.flatMap((chapter) =>
                        chapter.quizzes.every((quiz) => quiz.isCompleted && quiz.score && quiz.score >= 80) ? (
                          <div key={`${subject.id}-quiz-master`} className="p-4 border rounded-lg text-center dark:border-gray-700 dark:bg-gray-800">
                            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                            <h3 className="font-semibold">Quiz Master</h3>
                            <p className="text-sm text-gray-600">Completed all quizzes in {subject.name} with high scores</p>
                          </div>
                        ) : null
                      )
                    )
                  )}
                  {enrolledClasses.some((cls) => cls.progress >= 80) && (
                    <div className="p-4 border rounded-lg text-center dark:border-gray-700 dark:bg-gray-800">
                      <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Consistent Learner</h3>
                      <p className="text-sm text-gray-600">Achieved high progress in your class</p>
                    </div>
                  )}
                  {notifications.some((notif) => notif.type === 'grade') && (
                    <div className="p-4 border rounded-lg text-center dark:border-gray-700 dark:bg-gray-800">
                      <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Community Helper</h3>
                      <p className="text-sm text-gray-600">Received a grade notification</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {enrolledClasses.flatMap((cls) =>
                    cls.subjects.flatMap((subject) =>
                      subject.chapters.flatMap((chapter) =>
                        chapter.quizzes.every((quiz) => quiz.isCompleted && quiz.score && quiz.score >= 80) ? (
                          <div key={`${subject.id}-quiz-master`} className="p-4 border rounded-lg text-center dark:border-gray-700 dark:bg-gray-800">
                            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                            <h3 className="font-semibold">Quiz Master</h3>
                            <p className="text-sm text-gray-600">Completed all quizzes in {subject.name} with high scores</p>
                          </div>
                        ) : null
                      )
                    )
                  )}
                  {enrolledClasses.some((cls) => cls.progress >= 80) && (
                    <div className="p-4 border rounded-lg text-center dark:border-gray-700 dark:bg-gray-800">
                      <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Consistent Learner</h3>
                      <p className="text-sm text-gray-600">Achieved high progress in your class</p>
                    </div>
                  )}
                  {notifications.some((notif) => notif.type === 'grade') && (
                    <div className="p-4 border rounded-lg text-center dark:border-gray-700 dark:bg-gray-800">
                      <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Community Helper</h3>
                      <p className="text-sm text-gray-600">Received a grade notification</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={handleViewAchievements}>
                  View All Achievements
                </Button>
              </CardContent>
            </Card>
          <TabsContent value="subjects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledClasses.flatMap((cls) =>
                cls.subjects.map((subject) => (
                  <Card key={subject.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="dark:text-white">{subject.name}</CardTitle>
                        <Badge variant="outline" className="dark:border-gray-700 dark:bg-gray-800">
                          {subject.progress}% Complete
                        </Badge>
                      </div>
                      <CardDescription className="dark:text-gray-400">{cls.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={subject.progress} className="mb-4" />
                      <div className="space-y-2">
                        {subject.chapters.map((chapter) => (
                          <div key={chapter.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                            <span className="dark:text-white">{chapter.title}</span>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 dark:border-gray-700 dark:bg-gray-800">
                                {chapter.lessons.length} lessons
                              </Badge>
                              <Badge variant={chapter.progress >= 100 ? "default" : "outline"} className="dark:border-gray-700 dark:bg-gray-800">
                                {chapter.progress}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="subjects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledClasses.flatMap((cls) =>
                cls.subjects.map((subject) => (
                  <Card key={subject.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="dark:text-white">{subject.name}</CardTitle>
                        <Badge variant="outline" className="dark:border-gray-700 dark:bg-gray-800">
                          {subject.progress}% Complete
                        </Badge>
                      </div>
                      <CardDescription className="dark:text-gray-400">{cls.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={subject.progress} className="mb-4" />
                      <div className="space-y-2">
                        {subject.chapters.map((chapter) => (
                          <div key={chapter.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                            <span className="dark:text-white">{chapter.title}</span>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 dark:border-gray-700 dark:bg-gray-800">
                                {chapter.lessons.length} lessons
                              </Badge>
                              <Badge variant={chapter.progress >= 100 ? "default" : "outline"} className="dark:border-gray-700 dark:bg-gray-800">
                                {chapter.progress}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleViewSubject(subject.id)}>
                        View Subject
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="dark:text-white">Overall Progress</CardTitle>
                  <CardDescription className="dark:text-gray-400">Your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledClasses.map((cls) => (
                    <div key={cls.id} className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold dark:text-white">{cls.name}</h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{cls.progress}%</span>
                      </div>
                      <Progress value={cls.progress} className="mb-1" />
                      <div className="grid grid-cols-6 gap-1 mt-2">
                        {cls.subjects.map((subject) => (
                          <div key={subject.id} className="text-center">
                            <div 
                              className="w-full aspect-square rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-medium text-white"
                              style={{
                                background: `conic-gradient(#10b981 ${subject.progress}%, #e5e7eb ${subject.progress}%)`,
                              }}
                            >
                              {subject.progress}%
                            </div>
                            <p className="text-xs truncate dark:text-gray-400" title={subject.name}>
                              {subject.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="dark:text-white">Subject Breakdown</CardTitle>
                  <CardDescription className="dark:text-gray-400">Detailed progress by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enrolledClasses.flatMap(cls => 
                      cls.subjects.map(subject => (
                        <div key={subject.id}>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold dark:text-white">{subject.name}</h3>
                            <Badge variant={subject.progress >= 80 ? "default" : "outline"} className="dark:border-gray-700 dark:bg-gray-800">
                              {subject.progress}%
                            </Badge>
                          </div>
                          <Progress value={subject.progress} className="mb-4" />
                          
                          <div className="pl-4 border-l-2 border-green-500 dark:border-green-700 space-y-3">
                            {subject.chapters.map(chapter => (
                              <div key={chapter.id} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <p className="text-sm font-medium dark:text-white">{chapter.title}</p>
                                  <span className="text-xs text-gray-600 dark:text-gray-400">{chapter.progress}%</span>
                                </div>
                                <Progress value={chapter.progress} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="dark:text-white">Quiz Performance</CardTitle>
                <CardDescription className="dark:text-gray-400">Your quiz scores and completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrolledClasses.flatMap(cls => 
                    cls.subjects.flatMap(subject => 
                      subject.chapters.flatMap(chapter => 
                        chapter.quizzes.map(quiz => (
                          <div key={quiz.id} className="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold dark:text-white">{quiz.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{subject.name} - {chapter.title}</p>
                              </div>
                              <Badge variant={quiz.isCompleted ? (quiz.score && quiz.score >= 70 ? "default" : "destructive") : "outline"}>
                                {quiz.isCompleted ? `${quiz.score}%` : "Not taken"}
                              </Badge>
                            </div>
                            {quiz.isCompleted && quiz.score ? (
                              <div className="mt-2">
                                <Progress 
                                  value={quiz.score} 
                                  className={`h-2 ${
                                    quiz.score >= 80 ? 'bg-green-100 dark:bg-green-900/30' : 
                                    quiz.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                                    'bg-red-100 dark:bg-red-900/30'
                                  }`}
                                />
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-500">0%</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-500">100%</span>
                                </div>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => handleTakeQuiz(quiz.id)}>
                                Take Quiz
                              </Button>
                            )}
                            {quiz.isCompleted && (
                              <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => handleTakeQuiz(quiz.id)}>
                                <Settings className="mr-2 h-4 w-4" />
                                Retake Quiz
                              </Button>
                            )}
                          </div>
                        ))
                      )
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with your learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border rounded-lg ${!notification.isRead ? 'bg-green-50 dark:bg-green-900/20' : ''} dark:border-gray-700`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant={notification.type === 'quiz' ? 'default' : 'secondary'}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnerDashboard;

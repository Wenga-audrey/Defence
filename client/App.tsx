import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Institutions from "./pages/Institutions";
import Programs from "./pages/Programs";
import Ressources from "./pages/Ressources";
import Contact from "./pages/Contact";
import Admissions from "./pages/Admissions";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import GetStarted from "./pages/GetStarted";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import SubjectDetail from "./pages/SubjectDetail";
import StudyGroups from "./pages/StudyGroups";
import Forums from "./pages/Forums";
import ForumTopic from "./pages/ForumTopic";
import Exams from "./pages/Exams";
import ExamDetail from "./pages/ExamDetail";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import LearnerDashboard from "./pages/LearnerDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminClasses from "./pages/AdminClasses";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import StudyCalendar from "./pages/StudyCalendar";
import LessonPlayer from "./pages/LessonPlayer";
import Courses from "./pages/Courses";
import Scheduling from "./pages/Scheduling";
import Achievements from "./pages/Achievements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exam/:examId" element={<ExamDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/learner"
            element={
              <ProtectedRoute allow={["learner"]}>
                <LearnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute allow={["instructor", "admin", "super-admin"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allow={["admin", "super-admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/classes"
            element={
              <ProtectedRoute allow={["admin", "super-admin"]}>
                <AdminClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/super-admin"
            element={
              <ProtectedRoute allow={["super-admin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route path="/study-calendar" element={<StudyCalendar />} />
          <Route path="/lesson/:id" element={<LessonPlayer />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<Courses />} />
          <Route path="/subject/:id" element={<SubjectDetail />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/forum/:topicId" element={<ForumTopic />} />
          <Route
            path="/scheduling"
            element={
              <ProtectedRoute allow={["learner"]}>
                <Scheduling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute allow={["learner"]}>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

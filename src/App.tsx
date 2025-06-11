
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Sessions from "./pages/Sessions";
import Tracker from "./pages/Tracker";
import Course from "./pages/Course";
import Showcase from "./pages/Showcase";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";

// Coach pages
import CoachLogin from "./pages/CoachLogin";
import CoachSignUp from "./pages/CoachSignUp";
import HomeCoach from "./pages/HomeCoach";
import Mentees from "./pages/coach/Mentees";
import Applications from "./pages/coach/Applications";
import CoachSessions from "./pages/coach/CoachSessions";
import CoachCalendar from "./pages/coach/CoachCalendar";
import CoachChat from "./pages/coach/CoachChat";
import CVUpload from "./pages/coach/CVUpload";
import CoachTodos from "./pages/coach/CoachTodos";
import CoachProfile from "./pages/coach/CoachProfile";
import CoachSettings from "./pages/coach/CoachSettings";

import ProtectedCoachRoute from "./components/ProtectedCoachRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Coach routes */}
          <Route path="/coach" element={<HomeCoach />} />
          <Route path="/coach/login" element={<CoachLogin />} />
          <Route path="/coach/signup" element={<CoachSignUp />} />
          
          {/* Protected coach routes */}
          <Route path="/coach/mentees" element={<ProtectedCoachRoute><Mentees /></ProtectedCoachRoute>} />
          <Route path="/coach/applications" element={<ProtectedCoachRoute><Applications /></ProtectedCoachRoute>} />
          <Route path="/coach/sessions" element={<ProtectedCoachRoute><CoachSessions /></ProtectedCoachRoute>} />
          <Route path="/coach/calendar" element={<ProtectedCoachRoute><CoachCalendar /></ProtectedCoachRoute>} />
          <Route path="/coach/chat" element={<ProtectedCoachRoute><CoachChat /></ProtectedCoachRoute>} />
          <Route path="/coach/cv-upload" element={<ProtectedCoachRoute><CVUpload /></ProtectedCoachRoute>} />
          <Route path="/coach/todos" element={<ProtectedCoachRoute><CoachTodos /></ProtectedCoachRoute>} />
          <Route path="/coach/profile" element={<ProtectedCoachRoute><CoachProfile /></ProtectedCoachRoute>} />
          <Route path="/coach/settings" element={<ProtectedCoachRoute><CoachSettings /></ProtectedCoachRoute>} />
          
          {/* Mentee routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/course" element={<Course />} />
          <Route path="/chat" element={<ChatPage />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CoachLogin from "./pages/CoachLogin";
import CoachSignUp from "./pages/CoachSignUp";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Profile from "./pages/Profile";
import Sessions from "./pages/Sessions";
import Tracker from "./pages/Tracker";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import HomeCoach from "./pages/HomeCoach";
import CoachProfile from "./pages/coach/CoachProfile";
import CoachSessions from "./pages/coach/CoachSessions";
import CoachTodos from "./pages/coach/CoachTodos";
import CoachSettings from "./pages/coach/CoachSettings";
import Mentees from "./pages/coach/Mentees";
import CVUpload from "./pages/coach/CVUpload";
import Applications from "./pages/coach/Applications";
import CoachChat from "./pages/coach/CoachChat";
import Showcase from "./pages/Showcase";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/coach-login" element={<CoachLogin />} />
            <Route path="/coach-signup" element={<CoachSignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course" element={<Course />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/coach" element={<HomeCoach />} />
            <Route path="/coach/profile" element={<CoachProfile />} />
            <Route path="/coach/sessions" element={<CoachSessions />} />
            <Route path="/coach/todos" element={<CoachTodos />} />
            <Route path="/coach/settings" element={<CoachSettings />} />
            <Route path="/coach/mentees" element={<Mentees />} />
            <Route path="/coach/cv-upload" element={<CVUpload />} />
            <Route path="/coach/applications" element={<Applications />} />
            <Route path="/coach/chat" element={<CoachChat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

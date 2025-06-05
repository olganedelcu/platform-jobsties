
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import CoachSignUp from "./pages/CoachSignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Sessions from "./pages/Sessions";
import Profile from "./pages/Profile";
import Tracker from "./pages/Tracker";
import NotFound from "./pages/NotFound";
import Mentees from "./pages/coach/Mentees";
import CVUpload from "./pages/coach/CVUpload";
import CoachSessions from "./pages/coach/CoachSessions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/coach-signup" element={<CoachSignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/coach/mentees" element={<Mentees />} />
          <Route path="/coach/cv-upload" element={<CVUpload />} />
          <Route path="/coach/sessions" element={<CoachSessions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

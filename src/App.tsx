
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedCoachRoute from "./components/ProtectedCoachRoute";
import Index from "./pages/Index";
import HomeCoach from "./pages/HomeCoach";
import SignUp from "./pages/SignUp";
import CoachSignUp from "./pages/CoachSignUp";
import Login from "./pages/Login";
import CoachLogin from "./pages/CoachLogin";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Sessions from "./pages/Sessions";
import Profile from "./pages/Profile";
import Tracker from "./pages/Tracker";
import NotFound from "./pages/NotFound";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import Mentees from "./pages/coach/Mentees";
import CVUpload from "./pages/coach/CVUpload";
import CoachSessions from "./pages/coach/CoachSessions";
import CoachTodos from "./pages/coach/CoachTodos";
import Applications from "./pages/coach/Applications";
import CoachProfile from "./pages/coach/CoachProfile";
import CoachSettings from "./pages/coach/CoachSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home-coach" element={<HomeCoach />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/coach-signup" element={<CoachSignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/coach-login" element={<CoachLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/google-auth-callback" element={<GoogleAuthCallback />} />
          <Route path="/coach/mentees" element={
            <ProtectedCoachRoute>
              <Mentees />
            </ProtectedCoachRoute>
          } />
          <Route path="/coach/cv-upload" element={
            <ProtectedCoachRoute>
              <CVUpload />
            </ProtectedCoachRoute>
          } />
          <Route path="/coach/sessions" element={
            <ProtectedCoachRoute>
              <CoachSessions />
            </ProtectedCoachRoute>
          } />
          <Route path="/coach/todos" element={
            <ProtectedCoachRoute>
              <CoachTodos />
            </ProtectedCoachRoute>
          } />
          <Route path="/coach/applications" element={
            <ProtectedCoachRoute>
              <Applications />
            </ProtectedCoachRoute>
          } />
          <Route path="/coach/profile" element={
            <ProtectedCoachRoute>
              <CoachProfile />
            </ProtectedCoachRoute>
          } />
          <Route path="/coach/settings" element={
            <ProtectedCoachRoute>
              <CoachSettings />
            </ProtectedCoachRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

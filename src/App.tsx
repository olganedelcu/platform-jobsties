
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { NotificationProvider } from "@/contexts/NotificationContext";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Sessions from "./pages/Sessions";
import Messages from "./pages/Messages";
import Tracker from "./pages/Tracker";
import Course from "./pages/Course";
import CoachSignUp from "./pages/CoachSignUp";
import CoachLogin from "./pages/CoachLogin";
import CoachDashboard from "./pages/CoachDashboard";
import CVUpload from "./pages/coach/CVUpload";
import CoachSessions from "./pages/coach/CoachSessions";
import Mentees from "./pages/coach/Mentees";
import CoachSettings from "./pages/coach/CoachSettings";
import CoachProfile from "./pages/coach/CoachProfile";
import CoachTodos from "./pages/coach/CoachTodos";
import Applications from "./pages/coach/Applications";
import CoachCalendar from "./pages/coach/CoachCalendar";
import JobRecommendations from "./pages/coach/JobRecommendations";
import BackupManagementPage from "./pages/coach/BackupManagement";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <div className="text-lg">Loading...</div>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/tracker" element={<Tracker />} />
                <Route path="/course" element={<Course />} />
                <Route path="/chat" element={<ChatPage />} />
                
                {/* Coach Routes */}
                <Route path="/coach/signup" element={<CoachSignUp />} />
                <Route path="/coach/login" element={<CoachLogin />} />
                <Route path="/coach/mentees" element={<Mentees />} />
                <Route path="/coach/dashboard" element={<CoachDashboard />} />
                <Route path="/coach/cv-upload" element={<CVUpload />} />
                <Route path="/coach/sessions" element={<CoachSessions />} />
                <Route path="/coach/settings" element={<CoachSettings />} />
                <Route path="/coach/profile" element={<CoachProfile />} />
                <Route path="/coach/todos" element={<CoachTodos />} />
                <Route path="/coach/applications" element={<Applications />} />
                <Route path="/coach/calendar" element={<CoachCalendar />} />
                <Route path="/coach/job-recommendations" element={<JobRecommendations />} />
                <Route path="/coach/backup" element={<BackupManagementPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

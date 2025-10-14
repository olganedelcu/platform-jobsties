
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppLayout from "@/components/layout/AppLayout";

// Lazy load components for better performance
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const StudentLogin = lazy(() => import("./pages/StudentLogin"));
const StudentSignUp = lazy(() => import("./pages/StudentSignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Messages = lazy(() => import("./pages/Messages"));
const Tracker = lazy(() => import("./pages/Tracker"));
const Course = lazy(() => import("./pages/Course"));
const CoachSignUp = lazy(() => import("./pages/CoachSignUp"));
const CoachLogin = lazy(() => import("./pages/CoachLogin"));
const CoachDashboard = lazy(() => import("./pages/CoachDashboard"));
const CVUpload = lazy(() => import("./pages/coach/CVUpload"));
const CoachSessions = lazy(() => import("./pages/coach/CoachSessions"));
const Mentees = lazy(() => import("./pages/coach/Mentees"));
const CoachProfile = lazy(() => import("./pages/coach/CoachProfile"));
const CoachTodos = lazy(() => import("./pages/coach/CoachTodos"));
const Applications = lazy(() => import("./pages/coach/Applications"));
const CoachCalendar = lazy(() => import("./pages/coach/CoachCalendar"));
const JobRecommendations = lazy(() => import("./pages/coach/JobRecommendations"));
const BackupManagementPage = lazy(() => import("./pages/coach/BackupManagement"));
const CoachMessages = lazy(() => import("./pages/coach/CoachMessages"));
const MenteeTodosPage = lazy(() => import("./pages/MenteeTodosPage"));
const ApplicationDetail = lazy(() => import("./pages/ApplicationDetail"));
const TaskDetail = lazy(() => import("./pages/TaskDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              
              {/* Student Routes */}
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/student/signup" element={<StudentSignUp />} />
              <Route path="/student/dashboard" element={<Dashboard />} />
              <Route path="/student/tracker" element={<Tracker />} />
              <Route path="/student/todos" element={<MenteeTodosPage />} />
              <Route path="/student/profile" element={<Profile />} />
              <Route path="/student/backup" element={<BackupManagementPage />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/application/:id" element={<ApplicationDetail />} />
              <Route path="/course" element={<Course />} />
              <Route path="/todos" element={<MenteeTodosPage />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              
              {/* Coach Routes */}
              <Route path="/coach/signup" element={<CoachSignUp />} />
              <Route path="/coach/login" element={<CoachLogin />} />
              <Route path="/coach/mentees" element={<Mentees />} />
              <Route path="/coach/dashboard" element={<CoachDashboard />} />
              <Route path="/coach/cv-upload" element={<CVUpload />} />
              <Route path="/coach/sessions" element={<CoachSessions />} />
              <Route path="/coach/messages" element={<CoachMessages />} />
              <Route path="/coach/profile" element={<CoachProfile />} />
              <Route path="/coach/todos" element={<CoachTodos />} />
              <Route path="/coach/applications" element={<Applications />} />
              <Route path="/coach/calendar" element={<CoachCalendar />} />
              <Route path="/coach/job-recommendations" element={<JobRecommendations />} />
              <Route path="/coach/backup" element={<BackupManagementPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

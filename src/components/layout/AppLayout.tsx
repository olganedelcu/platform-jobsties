
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CoachNavigation from '@/components/CoachNavigation';
import StudentNavigation from '@/components/StudentNavigation';
import { useAuthState } from '@/hooks/useAuthState';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { user, loading, handleSignOut } = useAuthState();

  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/' || 
                    location.pathname === '/login' || 
                    location.pathname === '/signup' ||
                    location.pathname === '/coach/login' ||
                    location.pathname === '/coach/signup' ||
                    location.pathname === '/student/login' ||
                    location.pathname === '/student/signup';

  if (loading || isAuthPage || !user) {
    return <>{children}</>;
  }

  const isCoachRoute = location.pathname.startsWith('/coach/');
  const isStudentRoute = location.pathname.startsWith('/student/');

  return (
    <div className="min-h-screen bg-gray-50">
      {isCoachRoute ? (
        <CoachNavigation user={user} onSignOut={handleSignOut} />
      ) : isStudentRoute ? (
        <StudentNavigation user={user} onSignOut={handleSignOut} />
      ) : (
        <Navigation user={user} onSignOut={handleSignOut} />
      )}
      {children}
    </div>
  );
};

export default AppLayout;

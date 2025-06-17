
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import CoachNavigation from '@/components/CoachNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [layoutLoading, setLayoutLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Check user role if needed
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profile?.role || 'mentee');
        }
      } catch (error) {
        console.error('Layout auth initialization error:', error);
      } finally {
        setLayoutLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profile?.role || 'mentee');
        } else {
          setUser(null);
          setUserRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/' || 
                    location.pathname === '/login' || 
                    location.pathname === '/signup' ||
                    location.pathname === '/coach/login' ||
                    location.pathname === '/coach/signup';

  if (layoutLoading || isAuthPage || !user) {
    return <>{children}</>;
  }

  const isCoachRoute = location.pathname.startsWith('/coach/');

  return (
    <div className="min-h-screen bg-gray-50">
      {isCoachRoute ? (
        <CoachNavigation user={user} onSignOut={handleSignOut} />
      ) : (
        <Navigation user={user} onSignOut={handleSignOut} />
      )}
      {children}
    </div>
  );
};

export default AppLayout;

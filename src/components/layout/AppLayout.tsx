
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Layout auth session error:', error);
          setUser(null);
          setUserRole(null);
        } else if (session?.user) {
          setUser(session.user);
          
          // Check user role if needed
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (!profileError && profile) {
              setUserRole(profile.role);
            } else {
              // Fallback to metadata
              setUserRole(session.user.user_metadata?.role || 'MENTEE');
            }
          } catch (profileError) {
            console.error('Profile fetch error in layout:', profileError);
            setUserRole(session.user.user_metadata?.role || 'MENTEE');
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Layout auth initialization error:', error);
        setUser(null);
        setUserRole(null);
      } finally {
        setLayoutLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AppLayout auth state change:', event);
        
        if (session?.user) {
          setUser(session.user);
          
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (!profileError && profile) {
              setUserRole(profile.role);
            } else {
              setUserRole(session.user.user_metadata?.role || 'MENTEE');
            }
          } catch (error) {
            console.error('Profile fetch error in auth state change:', error);
            setUserRole(session.user.user_metadata?.role || 'MENTEE');
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Sign out error in layout:', error);
    }
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

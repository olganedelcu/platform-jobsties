
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);
  const isCheckingUser = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      if (isCheckingUser.current) return;
      isCheckingUser.current = true;

      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setUser(null);
          setSession(null);
        } else {
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
        
        setLoading(false);
        hasInitialized.current = true;

        // Handle redirects only after user state is set
        if (!currentSession) {
          const protectedPaths = ['/dashboard', '/coach/', '/tracker', '/sessions', '/messages', '/profile', '/todos'];
          const isOnProtectedPath = protectedPaths.some(path => 
            location.pathname.startsWith(path) || location.pathname === path
          );
          
          if (isOnProtectedPath && 
              location.pathname !== '/' && 
              location.pathname !== '/login' && 
              location.pathname !== '/signup' &&
              !location.pathname.startsWith('/coach/login') &&
              !location.pathname.startsWith('/coach/signup')) {
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setSession(null);
        setLoading(false);
        hasInitialized.current = true;
      } finally {
        isCheckingUser.current = false;
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.id);
        
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          const isDifferentUser = !user || user.id !== newSession.user.id;
          
          if (isDifferentUser || !hasInitialized.current) {
            setLoading(false);
            hasInitialized.current = true;
            
            // Only redirect on actual SIGNED_IN event
            const currentPath = location.pathname;
            const userRole = newSession.user.user_metadata?.role;
            
            // Don't redirect if already on the correct dashboard
            const isOnCorrectPage = (
              (userRole === 'COACH' && currentPath.startsWith('/coach/')) ||
              (userRole !== 'COACH' && (currentPath === '/dashboard' || currentPath.startsWith('/dashboard')))
            );

            if (!isOnCorrectPage) {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', newSession.user.id)
                  .single();
                
                if (profile?.role === 'COACH') {
                  navigate('/coach/mentees', { replace: true });
                } else {
                  navigate('/dashboard', { replace: true });
                }
              } catch (error) {
                console.error('Profile fetch error during redirect:', error);
                // Fallback to metadata
                if (userRole === 'COACH') {
                  navigate('/coach/mentees', { replace: true });
                } else {
                  navigate('/dashboard', { replace: true });
                }
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setLoading(false);
          hasInitialized.current = true;
          
          try {
            localStorage.removeItem('coach-applications-selected');
            localStorage.removeItem('coach-applications-view-mode');
            localStorage.removeItem('tracker-scroll-position');
          } catch (error) {
            console.error('Cleanup error:', error);
          }
          
          // Check if it's a coach based on current path and redirect appropriately
          if (location.pathname.startsWith('/coach/')) {
            navigate('/coach/login', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
        
        if (!hasInitialized.current) {
          setLoading(false);
          hasInitialized.current = true;
        }
      }
    );

    // THEN check for existing session if not already initialized
    if (!hasInitialized.current) {
      checkUser();
    }

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, user]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      
      try {
        localStorage.removeItem('coach-applications-selected');
        localStorage.removeItem('coach-applications-view-mode');
        localStorage.removeItem('tracker-scroll-position');
      } catch (error) {
        console.error('Cleanup error:', error);
      }
      
      // Check if it's a coach based on current path
      const isCoach = location.pathname.startsWith('/coach/');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      if (isCoach) {
        navigate('/coach/login', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    handleSignOut
  };
};

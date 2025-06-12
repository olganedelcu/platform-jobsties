
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);
  const isCheckingUser = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      if (isCheckingUser.current) return;
      isCheckingUser.current = true;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setUser(session?.user || null);
        setLoading(false);
        hasInitialized.current = true;

        // Handle redirects only after user state is set
        if (!session) {
          const protectedPaths = ['/coach/applications', '/tracker', '/coach/mentees'];
          const isOnProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
          
          if (!isOnProtectedPath && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
            navigate('/login');
          }
        }
      } catch (error) {
        setUser(null);
        setLoading(false);
        hasInitialized.current = true;
      } finally {
        isCheckingUser.current = false;
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          // Silent auth state change tracking
        }
        
        if (session?.user) {
          const isDifferentUser = !user || user.id !== session.user.id;
          if (isDifferentUser || !hasInitialized.current) {
            setUser(session.user);
            setLoading(false);
            hasInitialized.current = true;
            
            // Only redirect on actual SIGNED_IN event
            if (event === 'SIGNED_IN' && isDifferentUser) {
              const currentPath = location.pathname;
              const userRole = session.user.user_metadata?.role;
              
              // Don't redirect if already on the correct dashboard
              const isOnCorrectPage = (
                (userRole === 'COACH' && currentPath.startsWith('/coach/')) ||
                (userRole !== 'COACH' && (currentPath === '/dashboard' || currentPath === '/tracker'))
              );

              if (!isOnCorrectPage) {
                try {
                  const userRoleFromMetadata = session.user.user_metadata?.role;
                  
                  if (userRoleFromMetadata === 'COACH') {
                    navigate('/coach/mentees');
                  } else {
                    navigate('/dashboard');
                  }
                } catch (error) {
                  const userRoleFromMetadata = session.user.user_metadata?.role;
                  if (userRoleFromMetadata === 'COACH') {
                    navigate('/coach/mentees');
                  } else {
                    navigate('/dashboard');
                  }
                }
              }
            }
          }
        } else {
          if (user || !hasInitialized.current) {
            setUser(null);
            setLoading(false);
            hasInitialized.current = true;
          }
          
          if (event === 'SIGNED_OUT') {
            try {
              localStorage.removeItem('coach-applications-selected');
              localStorage.removeItem('coach-applications-view-mode');
              localStorage.removeItem('tracker-scroll-position');
            } catch (error) {
              // Silent cleanup
            }
            navigate('/');
          }
        }
      }
    );

    // Only check user if not already initialized
    if (!hasInitialized.current) {
      checkUser();
    }

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, user]);

  const handleSignOut = async () => {
    try {
      try {
        localStorage.removeItem('coach-applications-selected');
        localStorage.removeItem('coach-applications-view-mode');
        localStorage.removeItem('tracker-scroll-position');
      } catch (error) {
        // Silent cleanup
      }
      
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      // Silent error handling
    }
  };

  return {
    user,
    loading,
    handleSignOut
  };
};

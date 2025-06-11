
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session);
        
        if (!session) {
          setLoading(false);
          // Only redirect to login if we're not already on a public page
          if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
            // Check if user was on a protected page that should preserve state
            const protectedPaths = ['/coach/applications', '/tracker', '/coach/mentees'];
            const isOnProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
            
            if (!isOnProtectedPath) {
              navigate('/login');
            }
          }
          return;
        }
        
        setUser(session.user);
        setLoading(false);
        hasInitialized.current = true;
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
        // Only redirect to login if we're not already on a public page
        if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
          // Don't redirect if user is on a page that should preserve state
          const protectedPaths = ['/coach/applications', '/tracker', '/coach/mentees'];
          const isOnProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
          
          if (!isOnProtectedPath) {
            navigate('/login');
          }
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only log and process significant auth events, not every state check
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          console.log('Auth state changed:', event, session?.user?.user_metadata);
        }
        
        if (session?.user) {
          // Only update user state if it's actually different or if we haven't initialized
          const isDifferentUser = !user || user.id !== session.user.id;
          if (isDifferentUser || !hasInitialized.current) {
            setUser(session.user);
            setLoading(false);
            hasInitialized.current = true;
            
            // Only redirect on actual SIGNED_IN event (login/signup), not on page reload or token refresh
            if (event === 'SIGNED_IN' && isDifferentUser) {
              // Check if user is already on a valid page for their role
              const currentPath = location.pathname;
              const userRole = session.user.user_metadata?.role;
              
              // Don't redirect if already on the correct dashboard
              if (userRole === 'COACH' && currentPath.startsWith('/coach/')) {
                return; // Stay on current coach page
              }
              if (userRole !== 'COACH' && (currentPath === '/dashboard' || currentPath === '/tracker')) {
                return; // Stay on current mentee page
              }
              
              try {
                // First check the user's role from metadata for faster response
                const userRoleFromMetadata = session.user.user_metadata?.role;
                console.log('User role from metadata:', userRoleFromMetadata);
                
                if (userRoleFromMetadata === 'COACH') {
                  console.log('Redirecting to coach dashboard (from metadata)');
                  navigate('/coach/mentees');
                } else {
                  console.log('Redirecting to mentee dashboard (from metadata)');
                  navigate('/dashboard');
                }
                
                // Optional: Verify with database in background (no await to avoid blocking)
                setTimeout(async () => {
                  try {
                    const { data: profile, error } = await supabase
                      .from('profiles')
                      .select('role')
                      .eq('id', session.user.id)
                      .single();

                    console.log('Profile verification result:', { profile, error });
                    
                    // Only redirect if role differs from metadata
                    if (!error && profile.role !== userRoleFromMetadata) {
                      if (profile.role === 'COACH') {
                        navigate('/coach/mentees');
                      } else {
                        navigate('/dashboard');
                      }
                    }
                  } catch (error) {
                    console.error('Background role verification error:', error);
                  }
                }, 100);
                
              } catch (error) {
                console.error('Error during role check:', error);
                // If there's an error, use metadata as fallback
                const userRoleFromMetadata = session.user.user_metadata?.role;
                if (userRoleFromMetadata === 'COACH') {
                  console.log('Redirecting to coach dashboard (error fallback)');
                  navigate('/coach/mentees');
                } else {
                  console.log('Redirecting to mentee dashboard (error fallback)');
                  navigate('/dashboard');
                }
              }
            }
          }
        } else {
          // Only update state if we actually had a user before
          if (user || !hasInitialized.current) {
            setUser(null);
            setLoading(false);
            hasInitialized.current = true;
          }
          
          if (event === 'SIGNED_OUT') {
            // Clear any preserved state when signing out
            try {
              localStorage.removeItem('coach-applications-selected');
              localStorage.removeItem('coach-applications-view-mode');
              localStorage.removeItem('tracker-scroll-position');
            } catch (error) {
              console.error('Failed to clear localStorage on sign out:', error);
            }
            navigate('/');
          }
        }
      }
    );

    checkUser();

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const handleSignOut = async () => {
    try {
      // Clear localStorage before signing out
      try {
        localStorage.removeItem('coach-applications-selected');
        localStorage.removeItem('coach-applications-view-mode');
        localStorage.removeItem('tracker-scroll-position');
      } catch (error) {
        console.error('Failed to clear localStorage on manual sign out:', error);
      }
      
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    loading,
    handleSignOut
  };
};

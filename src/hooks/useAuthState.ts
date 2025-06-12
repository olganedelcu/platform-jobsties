
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

  const validateSession = (session: any) => {
    // Validate that this is a legitimate session, not a phantom one
    if (!session) return false;
    if (!session.user) return false;
    if (!session.access_token) return false;
    if (!session.refresh_token) return false;
    
    // Check if session is expired
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      console.log('Session expired, treating as invalid');
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    const checkUser = async () => {
      if (isCheckingUser.current) return;
      isCheckingUser.current = true;

      try {
        console.log('Checking user authentication state...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          setUser(null);
        } else if (validateSession(session)) {
          console.log('Valid session found for user:', session.user.id);
          setUser(session.user);
        } else {
          console.log('No valid session found, user remains unauthenticated');
          setUser(null);
          // Clear any phantom session data
          if (session && !validateSession(session)) {
            console.log('Clearing invalid session');
            await supabase.auth.signOut();
          }
        }
        
        setLoading(false);
        hasInitialized.current = true;

        // Handle redirects only after user state is set and validated
        if (!session || !validateSession(session)) {
          const protectedPaths = ['/coach/applications', '/tracker', '/coach/mentees'];
          const isOnProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
          
          if (!isOnProtectedPath && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
        setLoading(false);
        hasInitialized.current = true;
      } finally {
        isCheckingUser.current = false;
      }
    };

    // Set up auth state listener with proper validation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event, 'User ID:', session?.user?.id);
        
        // Only process valid authentication events
        if (event === 'SIGNED_IN' && validateSession(session)) {
          const isDifferentUser = !user || user.id !== session.user.id;
          if (isDifferentUser || !hasInitialized.current) {
            console.log('User successfully authenticated:', session.user.id);
            setUser(session.user);
            setLoading(false);
            hasInitialized.current = true;
            
            // Only redirect on actual SIGNED_IN event with valid session
            if (isDifferentUser) {
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
                  console.error('Navigation error:', error);
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
        } else if (event === 'SIGNED_OUT' || !validateSession(session)) {
          // Handle sign out or invalid sessions
          if (user || !hasInitialized.current) {
            console.log('User signed out or session invalid, clearing user state');
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
              // Cleanup error - silent
            }
            navigate('/');
          }
        } else if (event === 'INITIAL_SESSION') {
          // Handle initial session - validate before accepting
          console.log('Processing initial session...');
          if (validateSession(session)) {
            console.log('Initial session is valid for user:', session.user.id);
            setUser(session.user);
          } else {
            console.log('Initial session is invalid, keeping user unauthenticated');
            setUser(null);
            // Clear the invalid session
            if (session) {
              await supabase.auth.signOut();
            }
          }
          setLoading(false);
          hasInitialized.current = true;
        } else {
          // For any other event or invalid session, ensure user is null
          console.log('Unhandled auth event or invalid session, ensuring user is null');
          setUser(null);
          setLoading(false);
          hasInitialized.current = true;
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
        // Cleanup error - silent
      }
      
      console.log('Signing out user...');
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

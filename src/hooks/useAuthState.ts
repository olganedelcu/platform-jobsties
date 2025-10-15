
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
  const navigationInProgress = useRef(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup any existing subscription first
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

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

      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
          hasInitialized.current = true;
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        console.log('Auth state change:', event, newSession?.user?.id);
        
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Only handle navigation for actual auth events, not initial session loading
        if (event === 'SIGNED_IN' && newSession?.user && !navigationInProgress.current && hasInitialized.current) {
          // Only navigate if we're on an auth page or the current page doesn't match the user's role
          const isOnAuthPage = location.pathname === '/' || 
                              location.pathname === '/login' || 
                              location.pathname === '/signup' ||
                              location.pathname === '/coach/login' ||
                              location.pathname === '/coach/signup';
                              
          const userRole = newSession.user.user_metadata?.role;
          const isCoachOnCoachPage = userRole === 'COACH' && location.pathname.startsWith('/coach/');
          const isMenteeOnMenteePage = userRole !== 'COACH' && !location.pathname.startsWith('/coach/');
          
          // Only navigate if user is on wrong page type or auth page
          if (isOnAuthPage || (!isCoachOnCoachPage && !isMenteeOnMenteePage)) {
            navigationInProgress.current = true;
            
            setTimeout(() => {
              if (userRole === 'COACH') {
                navigate('/coach/mentees', { replace: true });
              } else {
                navigate('/dashboard', { replace: true });
              }
              
              navigationInProgress.current = false;
            }, 100);
          }
          
        } else if (event === 'SIGNED_OUT') {
          navigationInProgress.current = false;
          
          try {
            localStorage.removeItem('coach-applications-selected');
            localStorage.removeItem('coach-applications-view-mode');
            localStorage.removeItem('tracker-scroll-position');
          } catch (error) {
            console.error('Cleanup error:', error);
          }
          
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

    // Store subscription reference to prevent duplicates
    subscriptionRef.current = subscription;

    // Initialize auth state
    if (!hasInitialized.current) {
      initializeAuth();
    }

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [navigate, location.pathname]);

  const handleSignOut = async () => {
    if (navigationInProgress.current) return;
    
    try {
      setLoading(true);
      navigationInProgress.current = true;
      
      try {
        localStorage.removeItem('coach-applications-selected');
        localStorage.removeItem('coach-applications-view-mode');
        localStorage.removeItem('tracker-scroll-position');
      } catch (error) {
        console.error('Cleanup error:', error);
      }
      
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
      navigationInProgress.current = false;
    }
  };

  return {
    user,
    session,
    loading,
    handleSignOut
  };
};

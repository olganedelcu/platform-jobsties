
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.user_metadata);
        
        if (session?.user) {
          setUser(session.user);
          
          // Redirect based on user role after login
          if (event === 'SIGNED_IN') {
            const userRole = session.user.user_metadata?.role;
            console.log('User role:', userRole);
            
            if (userRole === 'COACH') {
              navigate('/coach/mentees');
            } else {
              navigate('/dashboard');
            }
          }
        } else {
          setUser(null);
          if (event === 'SIGNED_OUT') {
            navigate('/');
          }
        }
        setLoading(false);
      }
    );

    checkUser();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return {
    user,
    loading,
    handleSignOut
  };
};

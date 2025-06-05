
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
        console.log('Initial session check:', session);
        
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
          
          // Redirect based on user role after login or signup confirmation
          if (event === 'SIGNED_IN') {
            try {
              // First check the user's role from metadata
              const userRoleFromMetadata = session.user.user_metadata?.role;
              console.log('User role from metadata:', userRoleFromMetadata);
              
              // Wait a bit for the database trigger to complete
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Then check the user's role from the profiles table
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching user profile:', error);
                // If profile doesn't exist yet, use metadata role
                if (userRoleFromMetadata === 'COACH') {
                  console.log('Redirecting to coach dashboard (from metadata - profile not found)');
                  navigate('/coach/mentees');
                } else {
                  console.log('Redirecting to mentee dashboard (from metadata - profile not found)');
                  navigate('/dashboard');
                }
              } else {
                console.log('User role from profiles table:', profile.role);
                
                if (profile.role === 'COACH') {
                  console.log('Redirecting to coach dashboard (from profile)');
                  navigate('/coach/mentees');
                } else {
                  console.log('Redirecting to mentee dashboard (from profile)');
                  navigate('/dashboard');
                }
              }
            } catch (error) {
              console.error('Error during role check:', error);
              // If there's an error, check metadata as fallback
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
    try {
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

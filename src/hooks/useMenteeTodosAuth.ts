
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMenteeTodosAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
        navigate('/login');
        return;
      }

      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Authenticated user:', user.id, user.email);

      // Check if user is a mentee
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('Profile data:', profile);
      console.log('Profile error:', profileError);

      if (profileError) {
        console.error('Profile error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      if (profile?.role !== 'MENTEE') {
        console.log('User is not a mentee, role:', profile?.role);
        toast({
          title: "Access Denied",
          description: "You must be a mentee to access this page",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      console.log('User authenticated as mentee successfully');
      setUser(user);
    } catch (error: any) {
      console.error('Auth check error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to verify authentication",
        variant: "destructive"
      });
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    loading,
    handleSignOut
  };
};

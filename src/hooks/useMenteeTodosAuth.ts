
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { syncUserToProfile } from '@/utils/profileSyncUtils';

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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log('No authenticated user, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('User authenticated:', user.id);

      // Ensure user profile exists before checking role
      const profileSynced = await syncUserToProfile(user.id);
      if (!profileSynced) {
        console.error('Failed to sync user profile');
        toast({
          title: "Profile Error",
          description: "Failed to set up user profile. Please try logging in again.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Now check the user's role from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch user profile. Please try again.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Check if user is a mentee (case-insensitive)
      const userRole = profile?.role?.toLowerCase();
      if (userRole !== 'mentee') {
        console.log('User role:', userRole, 'Expected: mentee');
        toast({
          title: "Access Denied",
          description: "You must be a mentee to access this page",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      console.log('User authorized as mentee');
      setUser(user);
    } catch (error: any) {
      console.error('Auth check error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to verify authentication. Please try logging in again.",
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

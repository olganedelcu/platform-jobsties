
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProtectedCoachRouteProps {
  children: React.ReactNode;
}

const ProtectedCoachRoute = ({ children }: ProtectedCoachRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
        
        // Check if user is a coach
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          // Check metadata as fallback
          const userRole = session.user.user_metadata?.role;
          if (userRole !== 'COACH') {
            toast({
              title: "Access Denied",
              description: "You must be a coach to access this page.",
              variant: "destructive"
            });
            navigate('/dashboard');
            return;
          }
          setIsAuthorized(true);
        } else {
          if (profile.role !== 'COACH') {
            toast({
              title: "Access Denied",
              description: "You must be a coach to access this page.",
              variant: "destructive"
            });
            navigate('/dashboard');
            return;
          }
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedCoachRoute;

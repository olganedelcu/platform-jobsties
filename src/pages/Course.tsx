
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import Navigation from '@/components/Navigation';
import CourseContent from '@/components/course/CourseContent';
import { Loader2 } from 'lucide-react';

const Course = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  usePagePerformance('Course');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate('/login');
        return;
      }

      setUser(user);
    } catch (error: any) {
      console.error('Auth check error:', error);
      toast({
        title: "Error",
        description: "Authentication failed",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} onSignOut={handleSignOut} />
      <div className="pt-20">
        <CourseContent />
      </div>
    </div>
  );
};

export default Course;

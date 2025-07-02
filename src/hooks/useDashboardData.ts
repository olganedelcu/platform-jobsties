
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { courseModules } from '@/data/courseModules';

interface DashboardData {
  upcomingSessions: number;
  profileCompletion: number;
  courseProgress: number;
  loading: boolean;
}

export const useDashboardData = (userId: string): DashboardData => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    upcomingSessions: 0,
    profileCompletion: 0,
    courseProgress: 0,
    loading: true
  });

  useEffect(() => {
    if (!userId) return;
    
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch upcoming sessions count
      const { data: sessions, error: sessionsError } = await supabase
        .from('coaching_sessions')
        .select('id')
        .eq('mentee_id', userId)
        .gte('session_date', new Date().toISOString())
        .eq('status', 'confirmed');

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
      }

      // Fetch profile completion data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Calculate profile completion percentage
      let profileCompletion = 0;
      if (profile) {
        const fields = [
          profile.first_name,
          profile.last_name,
          profile.location,
          profile.phone,
          profile.website,
          profile.about,
          profile.profile_picture_url
        ];
        const filledFields = fields.filter(field => field && field.trim() !== '').length;
        profileCompletion = Math.round((filledFields / fields.length) * 100);
      }

      // Fetch course progress data
      const { data: courseData, error: courseError } = await supabase
        .from('course_progress')
        .select('module_title, completed, progress_percentage')
        .eq('user_id', userId);

      if (courseError) {
        console.error('Error fetching course progress:', courseError);
      }

      // Calculate overall course progress using the same logic as the course page
      let courseProgress = 0;
      if (courseData && courseData.length > 0) {
        // Count completed modules and calculate percentage based on total course modules
        const completedModules = courseData.filter(module => module.completed).length;
        courseProgress = Math.min((completedModules / courseModules.length) * 100, 100);
      } else {
        // If no real course data exists, fall back to CV progress calculation
        const { data: cvFiles, error: cvError } = await supabase
          .from('cv_files')
          .select('id')
          .eq('mentee_id', userId);

        if (cvError) {
          console.error('Error fetching CV files:', cvError);
        }

        // Calculate CV progress (20% per file, max 100%)
        const cvProgress = cvFiles ? Math.min(cvFiles.length * 20, 100) : 0;
        courseProgress = cvProgress;
      }

      setDashboardData({
        upcomingSessions: sessions?.length || 0,
        profileCompletion,
        courseProgress: Math.round(courseProgress),
        loading: false
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  return dashboardData;
};

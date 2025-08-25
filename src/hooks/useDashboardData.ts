
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { courseProgressService } from '@/services/courseProgressService';

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

      // Fetch course progress using the same service as the course page
      let courseProgress = 0;
      try {
        const courseData = await courseProgressService.fetchUserProgress(userId);
        
        if (courseData && courseData.length > 0) {
          // Calculate average progress across all modules (same as course page)
          const avgProgress = courseData.reduce((sum, module) => sum + module.progressPercentage, 0) / courseData.length;
          courseProgress = Math.round(avgProgress);
        }
      } catch (courseError) {
        console.error('Error fetching course progress:', courseError);
      }

      setDashboardData({
        upcomingSessions: sessions?.length || 0,
        profileCompletion,
        courseProgress,
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

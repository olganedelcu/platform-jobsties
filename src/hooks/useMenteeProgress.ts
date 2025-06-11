
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MenteeProgress {
  menteeId: string;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  hasRealData: boolean;
  emailConfirmed: boolean;
}

export const useMenteeProgress = (menteeIds: string[]) => {
  const [progressData, setProgressData] = useState<MenteeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);
  const lastFetchedIds = useRef<string>('');

  useEffect(() => {
    const currentIds = menteeIds.sort().join(',');
    
    // Prevent refetch if the mentee IDs haven't actually changed
    if (!isFirstLoad.current && lastFetchedIds.current === currentIds) {
      return;
    }

    if (menteeIds.length === 0) {
      setProgressData([]);
      setLoading(false);
      setError(null);
      return;
    }

    lastFetchedIds.current = currentIds;
    isFirstLoad.current = false;
    fetchMenteeProgress();
  }, [menteeIds]);

  const fetchMenteeProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching course progress for mentee IDs:', menteeIds);
      
      // First, check which users have confirmed emails by looking at profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', menteeIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw new Error(`Profile fetch error: ${profilesError.message}`);
      }

      // Fetch course progress for all mentees
      const { data: courseProgress, error: progressError } = await supabase
        .from('course_progress')
        .select('user_id, completed, progress_percentage, module_title')
        .in('user_id', menteeIds);

      if (progressError) {
        console.error('Error fetching mentee progress:', progressError);
        throw new Error(`Progress fetch error: ${progressError.message}`);
      }

      console.log('Raw course progress data:', courseProgress);
      console.log('Profiles data:', profiles);

      // Calculate progress for each mentee
      const progressMap = new Map<string, MenteeProgress>();
      
      // Initialize all mentees with 0 progress
      menteeIds.forEach(menteeId => {
        const profile = profiles?.find(p => p.id === menteeId);
        progressMap.set(menteeId, {
          menteeId,
          overallProgress: 0,
          completedModules: 0,
          totalModules: 5,
          hasRealData: false,
          emailConfirmed: !!profile // If we found a profile, email is likely confirmed
        });
      });

      // Update with actual progress data only if it exists
      if (courseProgress && courseProgress.length > 0) {
        const progressByMentee = courseProgress.reduce((acc, progress) => {
          if (!acc[progress.user_id]) {
            acc[progress.user_id] = [];
          }
          acc[progress.user_id].push(progress);
          return acc;
        }, {} as Record<string, any[]>);

        console.log('Progress grouped by mentee:', progressByMentee);

        Object.entries(progressByMentee).forEach(([menteeId, progressArray]) => {
          const completedModules = progressArray.filter(p => p.completed).length;
          const totalModules = Math.max(progressArray.length, 5); // Use actual module count or minimum 5
          const avgProgress = progressArray.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / progressArray.length;
          const overallProgress = Math.round(avgProgress);

          console.log(`Mentee ${menteeId} real progress: ${completedModules}/${totalModules} modules, ${overallProgress}% overall`);

          const existingData = progressMap.get(menteeId);
          progressMap.set(menteeId, {
            ...existingData!,
            overallProgress,
            completedModules,
            totalModules,
            hasRealData: true
          });
        });
      } else {
        console.log('No course progress data found for any mentees');
      }

      const finalProgressData = Array.from(progressMap.values());
      console.log('Final progress data:', finalProgressData);
      setProgressData(finalProgressData);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching mentee progress:', error);
      
      // Set error state and don't update progressData to prevent loops
      setError(error.message || 'Failed to fetch progress data');
      
      // Only set fallback data if we don't have any data yet
      if (progressData.length === 0) {
        const fallbackData = menteeIds.map((menteeId) => ({
          menteeId,
          overallProgress: 0,
          completedModules: 0,
          totalModules: 5,
          hasRealData: false,
          emailConfirmed: false
        }));
        
        setProgressData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  return { progressData, loading, error, refetch: fetchMenteeProgress };
};

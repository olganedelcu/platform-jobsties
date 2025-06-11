
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MenteeProgress {
  menteeId: string;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
}

export const useMenteeProgress = (menteeIds: string[]) => {
  const [progressData, setProgressData] = useState<MenteeProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (menteeIds.length === 0) {
      setProgressData([]);
      setLoading(false);
      return;
    }

    fetchMenteeProgress();
  }, [menteeIds]);

  const fetchMenteeProgress = async () => {
    try {
      setLoading(true);
      
      // Fetch course progress for all mentees
      const { data: courseProgress, error } = await supabase
        .from('course_progress')
        .select('user_id, completed, progress_percentage')
        .in('user_id', menteeIds);

      if (error) {
        console.error('Error fetching mentee progress:', error);
        return;
      }

      // Calculate progress for each mentee
      const progressMap = new Map<string, MenteeProgress>();
      
      // Initialize all mentees with 0 progress
      menteeIds.forEach(menteeId => {
        progressMap.set(menteeId, {
          menteeId,
          overallProgress: 0,
          completedModules: 0,
          totalModules: 5 // Based on courseModules.length
        });
      });

      // Update with actual progress data
      if (courseProgress && courseProgress.length > 0) {
        const progressByMentee = courseProgress.reduce((acc, progress) => {
          if (!acc[progress.user_id]) {
            acc[progress.user_id] = [];
          }
          acc[progress.user_id].push(progress);
          return acc;
        }, {} as Record<string, any[]>);

        Object.entries(progressByMentee).forEach(([menteeId, progressArray]) => {
          const completedModules = progressArray.filter(p => p.completed).length;
          const totalModules = 5; // Based on courseModules.length
          const overallProgress = Math.round((completedModules / totalModules) * 100);

          progressMap.set(menteeId, {
            menteeId,
            overallProgress,
            completedModules,
            totalModules
          });
        });
      }

      setProgressData(Array.from(progressMap.values()));
    } catch (error) {
      console.error('Error fetching mentee progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return { progressData, loading, refetch: fetchMenteeProgress };
};

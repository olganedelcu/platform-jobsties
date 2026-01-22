
import { useState, useEffect, useRef } from 'react';
import { courseProgressService, MenteeProgressSummary } from '@/services/courseProgressService';

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
      
      const summaries = await courseProgressService.fetchMenteeProgress(menteeIds);
      
      // Convert to the expected format
      const formattedData: MenteeProgress[] = summaries.map(summary => ({
        menteeId: summary.menteeId,
        overallProgress: summary.overallProgress,
        completedModules: summary.completedModules,
        totalModules: summary.totalModules,
        hasRealData: summary.hasRealData,
        emailConfirmed: summary.emailConfirmed
      }));

      setProgressData(formattedData);
      setError(null);
    } catch (error: unknown) {
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

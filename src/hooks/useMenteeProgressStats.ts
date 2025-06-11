
import { useMenteeProgress } from './useMenteeProgress';

export const useMenteeProgressStats = (menteeIds: string[]) => {
  const { progressData, loading } = useMenteeProgress(menteeIds);

  const getMenteeProgress = (menteeId: string) => {
    const data = progressData.find(p => p.menteeId === menteeId);
    return data || {
      overallProgress: 0,
      completedModules: 0,
      totalModules: 5,
      hasRealData: false,
      emailConfirmed: false
    };
  };

  // Only calculate average from mentees with real data
  const menteesWithRealData = progressData.filter(p => p.hasRealData);
  const averageProgress = menteesWithRealData.length > 0 
    ? Math.round(menteesWithRealData.reduce((sum, p) => sum + p.overallProgress, 0) / menteesWithRealData.length)
    : 0;

  return {
    progressData,
    loading,
    getMenteeProgress,
    averageProgress,
    menteesWithRealData: menteesWithRealData.length,
    totalMentees: progressData.length
  };
};

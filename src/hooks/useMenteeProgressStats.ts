
import { useMenteeProgress } from './useMenteeProgress';

export const useMenteeProgressStats = (menteeIds: string[]) => {
  const { progressData, loading } = useMenteeProgress(menteeIds);

  const getMenteeProgress = (menteeId: string) => {
    return progressData.find(p => p.menteeId === menteeId) || {
      overallProgress: 0,
      completedModules: 0,
      totalModules: 5
    };
  };

  const averageProgress = progressData.length > 0 
    ? Math.round(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / progressData.length)
    : 0;

  return {
    progressData,
    loading,
    getMenteeProgress,
    averageProgress
  };
};

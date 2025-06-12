
import { useState, useEffect } from 'react';
import { JobRecommendation } from '@/types/jobRecommendations';
import { useJobRecommendationArchive } from '@/hooks/useJobRecommendationArchive';
import { useJobRecommendationActions } from '@/hooks/useJobRecommendationActions';

interface UseEnhancedJobRecommendationsParams {
  userId: string;
}

export const useEnhancedJobRecommendations = ({ userId }: UseEnhancedJobRecommendationsParams) => {
  const [recommendations, setRecommendations] = useState<{
    active: JobRecommendation[];
    applied: JobRecommendation[];
    all: JobRecommendation[];
  }>({
    active: [],
    applied: [],
    all: []
  });
  const [loading, setLoading] = useState(true);

  const {
    loading: actionLoading,
    handleMarkAsApplied,
    handleArchive,
    handleReactivate,
    fetchRecommendationsByStatus
  } = useJobRecommendationArchive({
    userId,
    isCoach: false,
    onRecommendationUpdated: () => fetchAllRecommendations()
  });

  // Use the job recommendation actions hook for adding to job applications
  const { markAsApplied: addToJobTracker } = useJobRecommendationActions({ 
    user: { id: userId },
    onApplicationAdded: () => {
      fetchAllRecommendations();
    }
  });

  const fetchAllRecommendations = async () => {
    setLoading(true);
    try {
      const [activeRecs, appliedRecs, allRecs] = await Promise.all([
        fetchRecommendationsByStatus('active'),
        fetchRecommendationsByStatus('applied'),
        fetchRecommendationsByStatus()
      ]);

      setRecommendations({
        active: activeRecs,
        applied: appliedRecs,
        all: allRecs
      });
    } catch (error) {
      // Error handling without console logging
    } finally {
      setLoading(false);
    }
  };

  // Enhanced handler that both marks as applied AND adds to job tracker
  const handleMarkAsAppliedWithJobTracker = async (recommendation: JobRecommendation) => {
    // Verify the recommendation exists in our current data
    const exists = recommendations.all.find(rec => rec.id === recommendation.id);
    if (!exists) {
      await fetchAllRecommendations();
      return;
    }
    
    try {
      // First, add to job applications tracker
      await addToJobTracker(recommendation);
      
      // Then, mark the recommendation as applied in the recommendations system
      await handleMarkAsApplied(recommendation);
    } catch (error) {
      // If there's an error, still refresh the data to ensure consistency
      await fetchAllRecommendations();
    }
  };

  const handleArchiveWithValidation = async (recommendationId: string) => {
    const exists = recommendations.all.find(rec => rec.id === recommendationId);
    if (!exists) {
      await fetchAllRecommendations();
      return;
    }
    
    await handleArchive(recommendationId);
  };

  const handleReactivateWithValidation = async (recommendationId: string) => {
    const exists = recommendations.all.find(rec => rec.id === recommendationId);
    if (!exists) {
      await fetchAllRecommendations();
      return;
    }
    
    await handleReactivate(recommendationId);
  };

  useEffect(() => {
    if (userId) {
      fetchAllRecommendations();
    }
  }, [userId]);

  return {
    recommendations,
    loading,
    actionLoading,
    handleMarkAsAppliedWithJobTracker,
    handleArchiveWithValidation,
    handleReactivateWithValidation,
    fetchAllRecommendations
  };
};

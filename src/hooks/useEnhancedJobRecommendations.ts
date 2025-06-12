
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
      console.log('Job application added successfully');
      fetchAllRecommendations();
    }
  });

  const fetchAllRecommendations = async () => {
    setLoading(true);
    try {
      console.log('Fetching all recommendations for user:', userId);
      
      const [activeRecs, appliedRecs, allRecs] = await Promise.all([
        fetchRecommendationsByStatus('active'),
        fetchRecommendationsByStatus('applied'),
        fetchRecommendationsByStatus()
      ]);

      console.log('Fetched recommendations:', {
        active: activeRecs,
        applied: appliedRecs,
        all: allRecs
      });

      setRecommendations({
        active: activeRecs,
        applied: appliedRecs,
        all: allRecs
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced handler that both marks as applied AND adds to job tracker
  const handleMarkAsAppliedWithJobTracker = async (recommendation: JobRecommendation) => {
    console.log('Attempting to mark as applied and add to job tracker:', recommendation);
    
    // Verify the recommendation exists in our current data
    const exists = recommendations.all.find(rec => rec.id === recommendation.id);
    if (!exists) {
      console.error('Recommendation not found in current data:', recommendation.id);
      await fetchAllRecommendations();
      return;
    }
    
    try {
      // First, add to job applications tracker
      console.log('Adding recommendation to job tracker...');
      await addToJobTracker(recommendation);
      
      // Then, mark the recommendation as applied in the recommendations system
      console.log('Marking recommendation as applied...');
      await handleMarkAsApplied(recommendation);
      
      console.log('Successfully completed both operations');
    } catch (error) {
      console.error('Error in combined operation:', error);
      // If there's an error, still refresh the data to ensure consistency
      await fetchAllRecommendations();
    }
  };

  const handleArchiveWithValidation = async (recommendationId: string) => {
    console.log('Attempting to archive:', recommendationId);
    
    const exists = recommendations.all.find(rec => rec.id === recommendationId);
    if (!exists) {
      console.error('Recommendation not found in current data:', recommendationId);
      await fetchAllRecommendations();
      return;
    }
    
    await handleArchive(recommendationId);
  };

  const handleReactivateWithValidation = async (recommendationId: string) => {
    console.log('Attempting to reactivate:', recommendationId);
    
    const exists = recommendations.all.find(rec => rec.id === recommendationId);
    if (!exists) {
      console.error('Recommendation not found in current data:', recommendationId);
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

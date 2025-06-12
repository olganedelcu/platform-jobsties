
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { JobRecommendation } from '@/types/jobRecommendations';
import {
  markRecommendationAsApplied,
  archiveRecommendation,
  reactivateRecommendation,
  fetchJobRecommendationsByStatus
} from '@/services/jobRecommendationArchiveService';

interface UseJobRecommendationArchiveParams {
  userId: string;
  isCoach?: boolean;
  onRecommendationUpdated?: () => void;
}

export const useJobRecommendationArchive = ({
  userId,
  isCoach = false,
  onRecommendationUpdated
}: UseJobRecommendationArchiveParams) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleMarkAsApplied = async (recommendation: JobRecommendation) => {
    setLoading(true);
    try {
      await markRecommendationAsApplied(recommendation.id);
      
      toast({
        title: "Success",
        description: "Job recommendation marked as applied successfully.",
      });

      if (onRecommendationUpdated) {
        onRecommendationUpdated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark recommendation as applied. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (recommendationId: string) => {
    setLoading(true);
    try {
      await archiveRecommendation(recommendationId);
      
      toast({
        title: "Success",
        description: "Job recommendation archived successfully.",
      });

      if (onRecommendationUpdated) {
        onRecommendationUpdated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (recommendationId: string) => {
    setLoading(true);
    try {
      await reactivateRecommendation(recommendationId);
      
      toast({
        title: "Success",
        description: "Job recommendation reactivated successfully.",
      });

      if (onRecommendationUpdated) {
        onRecommendationUpdated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendationsByStatus = async (status?: 'active' | 'applied' | 'archived') => {
    return fetchJobRecommendationsByStatus(userId, status, isCoach);
  };

  return {
    loading,
    handleMarkAsApplied,
    handleArchive,
    handleReactivate,
    fetchRecommendationsByStatus
  };
};

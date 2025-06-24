
import { useState, useEffect } from 'react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useJobApplicationActions } from '@/hooks/useJobApplicationActions';
import { useAuthState } from '@/hooks/useAuthState';
import { useToast } from '@/hooks/use-toast';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format } from 'date-fns';

interface UseEnhancedJobRecommendationsProps {
  userId: string;
  onApplicationAdded?: () => void;
}

export const useEnhancedJobRecommendations = ({ userId, onApplicationAdded }: UseEnhancedJobRecommendationsProps) => {
  const { user } = useAuthState();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const { recommendations, loading, updateRecommendation } = useJobRecommendations({
    userId,
    isCoach: false
  });

  const { handleAddApplication } = useJobApplicationActions(user, [], () => {});

  const handleMarkAsAppliedWithJobTracker = async (recommendation: JobRecommendation) => {
    if (!user) return;
    
    setActionLoading(recommendation.id);
    
    try {
      // Add to job applications tracker with job link
      await handleAddApplication({
        dateApplied: format(new Date(), 'yyyy-MM-dd'),
        companyName: recommendation.company_name,
        jobTitle: recommendation.job_title,
        applicationStatus: 'applied',
        jobLink: recommendation.job_link // Include the job link from recommendation
      });

      // Update recommendation status
      await updateRecommendation(recommendation.id, {
        status: 'applied',
        applied_date: new Date().toISOString()
      });

      // Call callback if provided
      if (onApplicationAdded) {
        onApplicationAdded();
      }

      toast({
        title: "Application Added",
        description: `Your application to ${recommendation.company_name} has been added to your tracker.`,
      });
    } catch (error) {
      console.error('Error marking as applied:', error);
      toast({
        title: "Error",
        description: "Failed to add application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveWithValidation = async (recommendation: JobRecommendation) => {
    setActionLoading(recommendation.id);
    
    try {
      await updateRecommendation(recommendation.id, {
        archived: true,
        status: 'archived'
      });

      toast({
        title: "Job Archived",
        description: `${recommendation.job_title} at ${recommendation.company_name} has been archived.`,
      });
    } catch (error) {
      console.error('Error archiving recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to archive job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateWithValidation = async (recommendation: JobRecommendation) => {
    setActionLoading(recommendation.id);
    
    try {
      await updateRecommendation(recommendation.id, {
        archived: false,
        status: 'active'
      });

      toast({
        title: "Job Reactivated",
        description: `${recommendation.job_title} at ${recommendation.company_name} has been reactivated.`,
      });
    } catch (error) {
      console.error('Error reactivating recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to reactivate job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    recommendations,
    loading,
    actionLoading,
    handleMarkAsAppliedWithJobTracker,
    handleArchiveWithValidation,
    handleReactivateWithValidation
  };
};

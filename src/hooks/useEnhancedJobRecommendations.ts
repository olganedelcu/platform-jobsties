
import { useState, useEffect } from 'react';
import { useJobRecommendations } from './useJobRecommendations';
import { useJobRecommendationActions } from './useJobRecommendationActions';
import { JobRecommendation } from '@/types/jobRecommendations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseEnhancedJobRecommendationsParams {
  userId: string;
  isCoach?: boolean;
}

export const useEnhancedJobRecommendations = ({ userId, isCoach = false }: UseEnhancedJobRecommendationsParams) => {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const {
    recommendations: allRecommendations,
    loading,
    updateRecommendation,
    refetchRecommendations
  } = useJobRecommendations({ userId, isCoach });

  const { archiveRecommendation, reactivateRecommendation } = useJobRecommendationActions({
    updateRecommendation,
    refetchRecommendations
  });

  // Filter recommendations based on status and archived state
  const activeRecommendations = allRecommendations.filter(
    rec => rec.status === 'active' && !rec.archived
  );

  const appliedRecommendations = allRecommendations.filter(
    rec => rec.status === 'applied' && !rec.archived
  );

  const recommendations = {
    active: activeRecommendations,
    applied: appliedRecommendations,
    all: allRecommendations.filter(rec => !rec.archived)
  };

  const handleViewJob = (jobLink: string) => {
    window.open(jobLink, '_blank');
  };

  const handleMarkAsApplied = async (recommendation: JobRecommendation) => {
    setActionLoading(recommendation.id);
    
    try {
      // First, update the recommendation status to 'applied'
      await updateRecommendation(recommendation.id, { 
        status: 'applied',
        applied_date: new Date().toISOString()
      });

      // Then, create a job application entry
      const { error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          mentee_id: recommendation.mentee_id,
          company_name: recommendation.company_name,
          job_title: recommendation.job_title,
          job_link: recommendation.job_link,
          date_applied: new Date().toISOString().split('T')[0],
          application_status: 'applied',
          mentee_notes: `Applied from weekly recommendation: ${recommendation.description || ''}`
        });

      if (applicationError) {
        console.error('Error creating job application:', applicationError);
        throw applicationError;
      }

      toast({
        title: "Success",
        description: "Job marked as applied and added to your job tracker!",
      });

      // Switch to applied tab to show the updated status
      setActiveTab('applied');
    } catch (error: any) {
      console.error('Error marking job as applied:', error);
      toast({
        title: "Error",
        description: "Failed to mark job as applied. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (recommendationId: string) => {
    setActionLoading(recommendationId);
    try {
      await archiveRecommendation(recommendationId);
      toast({
        title: "Success",
        description: "Job recommendation archived successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (recommendationId: string) => {
    setActionLoading(recommendationId);
    try {
      await reactivateRecommendation(recommendationId);
      toast({
        title: "Success",
        description: "Job recommendation reactivated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    recommendations,
    loading,
    actionLoading,
    activeTab,
    setActiveTab,
    handleViewJob,
    handleMarkAsApplied,
    handleArchive,
    handleReactivate
  };
};

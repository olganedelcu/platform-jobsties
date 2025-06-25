
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { JobRecommendation } from '@/types/jobRecommendations';
import { addJobApplication } from '@/services/jobApplicationsService';
import { updateJobRecommendationStatus } from '@/services/jobRecommendationArchiveService';

interface UseJobRecommendationActionsProps {
  userId: string;
  addRecommendation?: (data: any) => Promise<any>;
  deleteRecommendation?: (id: string) => Promise<void>;
  updateRecommendation?: (id: string, updates: any) => Promise<void>;
  refetchRecommendations?: () => Promise<void>;
  user?: any;
  onApplicationAdded?: () => void;
}

export const useJobRecommendationActions = ({ 
  userId, 
  addRecommendation, 
  deleteRecommendation,
  updateRecommendation,
  refetchRecommendations,
  user,
  onApplicationAdded
}: UseJobRecommendationActionsProps) => {
  const { toast } = useToast();
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);

  const handleAssignToMoreMentees = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentSubmit = async (menteeIds: string[], weekStartDate: string) => {
    if (!selectedRecommendation || !addRecommendation) return;

    try {
      const promises = menteeIds.map(menteeId =>
        addRecommendation({
          menteeId,
          jobTitle: selectedRecommendation.job_title,
          jobLink: selectedRecommendation.job_link,
          companyName: selectedRecommendation.company_name,
          description: selectedRecommendation.description,
          weekStartDate
        })
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `Job recommendation assigned to ${menteeIds.length} additional mentee(s).`,
      });

      setAssignmentDialogOpen(false);
      setSelectedRecommendation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign job recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectAssignment = (assignmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignments(prev => [...prev, assignmentId]);
    } else {
      setSelectedAssignments(prev => prev.filter(id => id !== assignmentId));
    }
  };

  const handleSelectAll = (checked: boolean, recommendations: any[]) => {
    if (checked) {
      const allAssignmentIds = recommendations.map(rec => rec.id);
      setSelectedAssignments(allAssignmentIds);
    } else {
      setSelectedAssignments([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAssignments.length === 0 || !deleteRecommendation) return;

    try {
      const promises = selectedAssignments.map(id => deleteRecommendation(id));
      await Promise.all(promises);

      toast({
        title: "Success",
        description: `${selectedAssignments.length} recommendation(s) deleted successfully.`,
      });

      setSelectedAssignments([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const closeAssignmentDialog = () => {
    setAssignmentDialogOpen(false);
    setSelectedRecommendation(null);
  };

  const archiveRecommendation = async (recommendationId: string) => {
    if (updateRecommendation) {
      await updateRecommendation(recommendationId, { archived: true });
      if (refetchRecommendations) {
        await refetchRecommendations();
      }
    }
  };

  const reactivateRecommendation = async (recommendationId: string) => {
    if (updateRecommendation) {
      await updateRecommendation(recommendationId, { archived: false });
      if (refetchRecommendations) {
        await refetchRecommendations();
      }
    }
  };

  // Mentee functionality: Mark recommendation as applied and add to job tracker with description in notes
  const markAsApplied = async (recommendation: JobRecommendation) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare mentee notes with job description
      const menteeNotes = recommendation.description 
        ? `Job Description: ${recommendation.description}`
        : undefined;

      // Add to job applications tracker with description in notes
      await addJobApplication(user.id, {
        job_title: recommendation.job_title,
        company_name: recommendation.company_name,
        date_applied: new Date().toISOString().split('T')[0],
        application_status: 'applied',
        mentee_notes
      });

      // Update recommendation status
      await updateJobRecommendationStatus(recommendation.id, {
        status: 'applied',
        applied_date: new Date().toISOString(),
        application_stage: 'applied'
      });

      toast({
        title: "Success",
        description: `Application for ${recommendation.job_title} at ${recommendation.company_name} has been added to your tracker${recommendation.description ? ' with job description in your notes' : ''}.`,
      });

      // Call the callback if provided
      if (onApplicationAdded) {
        onApplicationAdded();
      }
    } catch (error) {
      console.error('Error marking recommendation as applied:', error);
      toast({
        title: "Error",
        description: "Failed to mark recommendation as applied. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedRecommendation,
    assignmentDialogOpen,
    selectedAssignments,
    handleAssignToMoreMentees,
    handleAssignmentSubmit,
    handleSelectAssignment,
    handleSelectAll,
    handleDeleteSelected,
    closeAssignmentDialog,
    markAsApplied,
    archiveRecommendation,
    reactivateRecommendation
  };
};

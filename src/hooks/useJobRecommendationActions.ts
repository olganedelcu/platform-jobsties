
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';

interface UseJobRecommendationActionsProps {
  userId: string;
  addRecommendation: (data: any) => Promise<any>;
  deleteRecommendation: (id: string) => Promise<void>;
}

export const useJobRecommendationActions = ({ 
  userId, 
  addRecommendation, 
  deleteRecommendation 
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
    if (!selectedRecommendation) return;

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
    if (selectedAssignments.length === 0) return;

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

  return {
    selectedRecommendation,
    assignmentDialogOpen,
    selectedAssignments,
    handleAssignToMoreMentees,
    handleAssignmentSubmit,
    handleSelectAssignment,
    handleSelectAll,
    handleDeleteSelected,
    closeAssignmentDialog
  };
};

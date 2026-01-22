
import React from 'react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useAuthState } from '@/hooks/useAuthState';
import { useToast } from '@/hooks/use-toast';

interface ValidRecommendation {
  jobTitle: string;
  jobLink: string;
  companyName: string;
  description?: string;
}

interface JobRecommendationFormActionsProps {
  selectedMentees: string[];
  weekStartDate: string;
  getValidRecommendations: () => ValidRecommendation[];
  resetForm: () => void;
  setIsFormOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const JobRecommendationFormActions = ({
  selectedMentees,
  weekStartDate,
  getValidRecommendations,
  resetForm,
  setIsFormOpen,
  children
}: JobRecommendationFormActionsProps) => {
  const { user } = useAuthState();
  const { toast } = useToast();
  const { addRecommendation } = useJobRecommendations({ 
    userId: user?.id || '', 
    isCoach: true 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMentees.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one mentee.",
        variant: "destructive"
      });
      return;
    }

    const validRecommendations = getValidRecommendations();

    if (validRecommendations.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in at least one complete job recommendation.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create all combinations of mentees and recommendations
      const promises = [];
      for (const menteeId of selectedMentees) {
        for (const rec of validRecommendations) {
          promises.push(
            addRecommendation({
              menteeId,
              jobTitle: rec.jobTitle,
              jobLink: rec.jobLink,
              companyName: rec.companyName,
              description: rec.description,
              weekStartDate
            })
          );
        }
      }

      await Promise.all(promises);

      const totalRecommendations = validRecommendations.length * selectedMentees.length;
      
      toast({
        title: "Success",
        description: `${totalRecommendations} job recommendation(s) sent successfully to ${selectedMentees.length} mentee(s).`,
      });

      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error sending recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to send job recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

export default JobRecommendationFormActions;

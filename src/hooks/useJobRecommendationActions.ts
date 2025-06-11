
import { useToast } from '@/hooks/use-toast';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format } from 'date-fns';

interface UseJobRecommendationActionsProps {
  user: any;
  onApplicationAdded?: () => void;
}

export const useJobRecommendationActions = ({ user, onApplicationAdded }: UseJobRecommendationActionsProps) => {
  const { toast } = useToast();
  const { handleAddApplication } = useJobApplicationsData(user);

  const markAsApplied = async (recommendation: JobRecommendation) => {
    console.log('Starting markAsApplied for:', recommendation.id);
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add applications.",
        variant: "destructive"
      });
      return;
    }

    try {
      const applicationData = {
        dateApplied: format(new Date(), 'yyyy-MM-dd'),
        companyName: recommendation.company_name,
        jobTitle: recommendation.job_title,
        applicationStatus: 'applied',
        menteeNotes: `Applied via coach recommendation from week of ${format(new Date(recommendation.week_start_date), 'MMM dd, yyyy')}`
      };

      console.log('Adding application with data:', applicationData);
      await handleAddApplication(applicationData);
      
      toast({
        title: "Success",
        description: `${recommendation.job_title} at ${recommendation.company_name} has been added to your tracker.`,
      });

      // Only call the callback if it exists and after successful addition
      if (onApplicationAdded) {
        console.log('Calling onApplicationAdded callback');
        // Use setTimeout to prevent immediate re-render issues
        setTimeout(() => {
          onApplicationAdded();
        }, 100);
      }
    } catch (error) {
      console.error('Error adding application from recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to add job to tracker. Please try again.",
        variant: "destructive"
      });
      throw error; // Re-throw to let the component handle the error state
    }
  };

  return {
    markAsApplied
  };
};

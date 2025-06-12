
import { useToast } from '@/hooks/use-toast';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format, startOfWeek } from 'date-fns';

interface UseJobRecommendationActionsProps {
  user: any;
  onApplicationAdded?: () => void;
}

export const useJobRecommendationActions = ({ user, onApplicationAdded }: UseJobRecommendationActionsProps) => {
  const { toast } = useToast();
  const { handleAddApplication } = useJobApplicationsData(user);

  const markAsApplied = async (recommendation: JobRecommendation) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add applications.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the current week start date
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday as start of week
      
      const applicationData = {
        dateApplied: format(new Date(), 'yyyy-MM-dd'),
        companyName: recommendation.company_name,
        jobTitle: recommendation.job_title,
        applicationStatus: 'applied',
        menteeNotes: `Applied via Coach Recommendation from week of ${format(currentWeekStart, 'MMM dd, yyyy')}`
      };

      await handleAddApplication(applicationData);
      
      toast({
        title: "Added to tracker",
        description: `${recommendation.job_title} at ${recommendation.company_name}`,
        className: "fixed top-4 right-4 w-80 max-w-sm"
      });

      // Only call the callback if it exists and after successful addition
      if (onApplicationAdded) {
        // Use setTimeout to prevent immediate re-render issues
        setTimeout(() => {
          onApplicationAdded();
        }, 100);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job to tracker. Please try again.",
        variant: "destructive",
        className: "fixed top-4 right-4 w-80 max-w-sm"
      });
      throw error; // Re-throw to let the component handle the error state
    }
  };

  return {
    markAsApplied
  };
};

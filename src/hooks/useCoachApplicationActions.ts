
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/types/jobApplications';
import { updateCoachMenteeApplication } from '@/services/coachApplicationsService';

export const useCoachApplicationActions = (
  applications: JobApplication[],
  refetchApplications: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleUpdateApplication = async (applicationId: string, updates: Partial<JobApplication>): Promise<void> => {
    try {
      await updateCoachMenteeApplication(applicationId, updates);
      await refetchApplications();
      
      toast({
        title: "Application Updated",
        description: "The application has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleUpdateApplication
  };
};

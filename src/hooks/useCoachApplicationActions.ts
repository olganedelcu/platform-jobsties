
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/types/jobApplications';
import { updateCoachMenteeApplication, deleteCoachMenteeApplication } from '@/services/coachApplicationsService';

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

  const handleDeleteApplication = async (applicationId: string): Promise<void> => {
    try {
      await deleteCoachMenteeApplication(applicationId);
      await refetchApplications();
      
      toast({
        title: "Application Deleted",
        description: "The application has been removed from your view.",
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleUpdateApplication,
    handleDeleteApplication
  };
};

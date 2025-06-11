
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
      console.log('Hook: Starting delete process for application:', applicationId);
      console.log('Hook: Current applications count before delete:', applications.length);
      console.log('Hook: Applications before delete:', applications.map(app => ({ id: app.id, company: app.company_name })));
      
      await deleteCoachMenteeApplication(applicationId);
      console.log('Hook: Delete service call completed, now refetching...');
      
      // Add a small delay to ensure the database has processed the delete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await refetchApplications();
      console.log('Hook: Refetch completed');
      
      toast({
        title: "Application Deleted",
        description: "The application has been removed from your view.",
      });
    } catch (error) {
      console.error('Hook: Error deleting application:', error);
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

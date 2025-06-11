
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/types/jobApplications';
import { updateCoachMenteeApplication, hideCoachMenteeApplication } from '@/services/coachApplicationsService';

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
      console.log('Hook: Starting hide process for application:', applicationId);
      console.log('Hook: Current applications count before hide:', applications.length);
      console.log('Hook: Applications before hide:', applications.map(app => ({ id: app.id, company: app.company_name })));
      
      await hideCoachMenteeApplication(applicationId);
      console.log('Hook: Hide service call completed, now refetching...');
      
      // Add a small delay to ensure the database has processed the hide operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await refetchApplications();
      console.log('Hook: Refetch completed');
      
      toast({
        title: "Application Hidden",
        description: "The application has been removed from your view.",
      });
    } catch (error) {
      console.error('Hook: Error hiding application:', error);
      toast({
        title: "Error",
        description: "Failed to remove application from view. Please try again.",
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


import { useToast } from '@/hooks/use-toast';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';
import { 
  addJobApplication, 
  updateJobApplication, 
  deleteJobApplication 
} from '@/services/jobApplicationsService';

export const useJobApplicationActions = (
  user: any,
  applications: JobApplication[],
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>
) => {
  const { toast } = useToast();

  const handleAddApplication = async (applicationData: NewJobApplicationData): Promise<void> => {
    if (!user) return;

    try {
      const newApplication = await addJobApplication(user.id, applicationData);
      // Add new application at the top of the list
      setApplications(prev => [newApplication, ...prev]);
      
      toast({
        title: "Application Added",
        description: `Your application to ${applicationData.companyName} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateApplication = async (applicationId: string, updates: Partial<JobApplication>): Promise<void> => {
    if (!user) return;
    
    try {
      await updateJobApplication(user.id, applicationId, updates);

      // Update the applications list with the new data
      setApplications(prev => 
        prev.map(application => 
          application.id === applicationId 
            ? { ...application, ...updates }
            : application
        )
      );
      
      toast({
        title: "Application Updated",
        description: "Your application has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApplication = async (applicationId: string): Promise<void> => {
    if (!user) return;
    
    try {
      await deleteJobApplication(user.id, applicationId);

      setApplications(prev => prev.filter(application => application.id !== applicationId));
      
      toast({
        title: "Application Deleted",
        description: "Your application has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleAddApplication,
    handleUpdateApplication,
    handleDeleteApplication
  };
};

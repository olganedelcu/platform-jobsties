
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchMenteeApplications, updateApplicationNotes } from '@/services/coachApplicationsService';
import { JobApplication } from '@/types/jobApplications';

export const useCoachApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const applicationsData = await fetchMenteeApplications();
      console.log('Fetched applications:', applicationsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching mentee applications:', error);
      toast({
        title: "Error",
        description: "Failed to load mentee applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotes = async (applicationId: string, notes: string) => {
    try {
      await updateApplicationNotes(applicationId, notes);
      
      // Update the local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, coach_notes: notes }
            : app
        )
      );
      
      toast({
        title: "Notes Updated",
        description: "Your notes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    handleUpdateNotes,
    refetchApplications: fetchApplications
  };
};

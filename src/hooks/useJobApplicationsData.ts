
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchJobApplications } from '@/services/jobApplicationsService';
import { useJobApplicationActions } from '@/hooks/useJobApplicationActions';
import { JobApplication, JobApplicationsHookReturn } from '@/types/jobApplications';

export const useJobApplicationsData = (user: any): JobApplicationsHookReturn => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { 
    handleAddApplication, 
    handleUpdateApplication, 
    handleDeleteApplication 
  } = useJobApplicationActions(user, applications, setApplications);

  const fetchUserApplications = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const applicationsData = await fetchJobApplications(user.id);
      setApplications(applicationsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    fetchUserApplications();
  }, [fetchUserApplications]);

  return {
    applications,
    loading,
    handleAddApplication,
    handleUpdateApplication,
    handleDeleteApplication,
    refetchApplications: fetchUserApplications
  };
};

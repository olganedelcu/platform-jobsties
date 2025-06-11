
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchMenteeApplications } from '@/services/coachApplicationsService';
import { JobApplication } from '@/types/jobApplications';

export const useCoachApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      console.log('useCoachApplications: Starting fetchApplications...');
      setLoading(true);
      const applicationsData = await fetchMenteeApplications();
      console.log('useCoachApplications: Fetched applications data:', applicationsData);
      console.log('useCoachApplications: Applications count:', applicationsData.length);
      console.log('useCoachApplications: Sample application:', applicationsData[0]);
      setApplications(applicationsData);
      console.log('useCoachApplications: Applications state updated');
      
      if (applicationsData.length === 0) {
        console.log('useCoachApplications: No applications found - this might be normal if mentees haven\'t added applications yet');
      }
    } catch (error) {
      console.error('useCoachApplications: Error fetching mentee applications:', error);
      toast({
        title: "Error",
        description: "Failed to load mentee applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('useCoachApplications: Loading set to false');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    refetchApplications: fetchApplications
  };
};

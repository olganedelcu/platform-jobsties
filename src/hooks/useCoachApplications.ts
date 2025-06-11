
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
      console.log('Hook: Starting fetchApplications...');
      setLoading(true);
      const applicationsData = await fetchMenteeApplications();
      console.log('Hook: Fetched applications data:', applicationsData);
      console.log('Hook: Applications count:', applicationsData.length);
      console.log('Hook: Application IDs:', applicationsData.map(app => app.id));
      setApplications(applicationsData);
      console.log('Hook: Applications state updated');
    } catch (error) {
      console.error('Error fetching mentee applications:', error);
      toast({
        title: "Error",
        description: "Failed to load mentee applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('Hook: Loading set to false');
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

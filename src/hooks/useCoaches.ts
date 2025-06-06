
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchCoaches } from '@/services/coachesService';
import { Coach, CoachesHookReturn } from '@/types/coaches';

export const useCoaches = (): CoachesHookReturn => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCoaches = async () => {
    try {
      setLoading(true);
      const coachesData = await fetchCoaches();
      setCoaches(coachesData);
    } catch (error) {
      console.error('Error fetching coaches:', error);
      toast({
        title: "Error",
        description: "Failed to load coaches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoaches();
  }, []);

  return {
    coaches,
    loading,
    refetchCoaches: loadCoaches
  };
};

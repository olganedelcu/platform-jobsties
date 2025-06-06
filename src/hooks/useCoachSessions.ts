
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchCoachSessions } from '@/services/coachSessionsService';
import { useCoachSessionActions } from '@/hooks/useCoachSessionActions';
import { CoachSession, CoachSessionsHookReturn } from '@/types/coachSessions';

export const useCoachSessions = (user: any): CoachSessionsHookReturn => {
  const [sessions, setSessions] = useState<CoachSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { handleConfirmSession, handleCancelSession } = useCoachSessionActions(
    user,
    sessions,
    setSessions
  );

  const fetchSessions = async () => {
    if (!user) {
      console.log('No user found, skipping session fetch');
      setLoading(false);
      return;
    }
    
    console.log('Fetching sessions for user:', user.id);
    
    try {
      setLoading(true);
      const sessionsData = await fetchCoachSessions(user.id);
      console.log('Successfully fetched sessions:', sessionsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching coach sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load sessions. Please try again.",
        variant: "destructive",
      });
      setSessions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    loading,
    handleConfirmSession,
    handleCancelSession,
    refetchSessions: fetchSessions
  };
};

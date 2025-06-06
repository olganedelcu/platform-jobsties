
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchSessions } from '@/services/sessionsService';
import { useSessionActions } from '@/hooks/useSessionActions';
import { Session, SessionsDataHookReturn } from '@/types/sessions';

export const useSessionsData = (user: any): SessionsDataHookReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { 
    handleAddSession, 
    handleUpdateSession, 
    handleDeleteSession 
  } = useSessionActions(user, sessions, setSessions);

  const fetchUserSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const sessionsData = await fetchSessions(user.id);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load sessions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSessions();
  }, [user]);

  return {
    sessions,
    loading,
    handleAddSession,
    handleUpdateSession,
    handleDeleteSession,
    refetchSessions: fetchUserSessions
  };
};

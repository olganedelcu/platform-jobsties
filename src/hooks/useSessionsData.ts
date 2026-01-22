
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchSessions } from '@/services/sessionsService';
import { useSessionActions } from '@/hooks/useSessionActions';
import { Session, SessionsDataHookReturn, NewSessionData } from '@/types/sessions';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useSessionsData = (user: User | null): SessionsDataHookReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
      
      // Debug: Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Current user profile:', profile);
      console.log('Profile error:', profileError);
      
      const sessionsData = await fetchSessions(user.id);
      console.log('Fetched sessions for user:', sessionsData);
      
      // Deduplicate sessions by ID to prevent duplicates
      const uniqueSessions = sessionsData.filter((session, index, self) => 
        index === self.findIndex(s => s.id === session.id)
      );
      
      setSessions(uniqueSessions);
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

  const handleAddSessionWithRefresh = async (sessionData: NewSessionData) => {
    await handleAddSession(sessionData);
    // Trigger a refresh of the component using the availability hook
    setRefreshTrigger(prev => prev + 1);
    // Also refresh the sessions list to get the latest data
    await fetchUserSessions();
  };

  const handleDeleteSessionWithRefresh = async (sessionId: string) => {
    await handleDeleteSession(sessionId);
    // Trigger a refresh to update availability
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchUserSessions();
  }, [user, refreshTrigger]);

  return {
    sessions,
    loading,
    handleAddSession: handleAddSessionWithRefresh,
    handleUpdateSession,
    handleDeleteSession: handleDeleteSessionWithRefresh,
    refetchSessions: fetchUserSessions
  };
};

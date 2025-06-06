
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  session_type: string;
  session_date: string;
  duration: number;
  notes: string;
  preferred_coach: string;
  status: string;
  meeting_link: string;
  coach_id: string;
  mentee_id: string;
  created_at: string;
  updated_at: string;
}

interface NewSessionData {
  sessionType: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  preferredCoach: string;
}

export const useSessionsData = (user: any) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select('*')
        .eq('mentee_id', user.id)
        .order('session_date', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load sessions. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (sessionData: NewSessionData) => {
    if (!user) return;

    try {
      // Combine date and time into a proper timestamp
      const sessionDateTime = new Date(`${sessionData.date}T${sessionData.time}:00`);
      
      // If a specific coach was selected, try to find their ID
      let coachId = null;
      if (sessionData.preferredCoach) {
        // Extract first and last name from the selected coach
        const nameParts = sessionData.preferredCoach.split(' ');
        if (nameParts.length >= 2) {
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          
          // Try to find the coach ID using first and last name
          const { data: coachData } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'coach')
            .eq('first_name', firstName)
            .eq('last_name', lastName)
            .single();
            
          if (coachData) {
            coachId = coachData.id;
          }
        }
      }
      
      const { data, error } = await supabase
        .from('coaching_sessions')
        .insert({
          mentee_id: user.id,
          session_type: sessionData.sessionType,
          session_date: sessionDateTime.toISOString(),
          duration: parseInt(sessionData.duration),
          notes: sessionData.notes,
          preferred_coach: sessionData.preferredCoach,
          status: 'pending',
          // If we found the coach ID, use it, otherwise leave it null
          coach_id: coachId
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding session:', error);
        toast({
          title: "Error",
          description: "Failed to schedule session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSessions(prev => [...prev, data]);
      toast({
        title: "Session Scheduled",
        description: `Your ${sessionData.sessionType} session has been scheduled for ${sessionData.date} at ${sessionData.time}`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSession = async (sessionId: string, updates: Partial<Session>) => {
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .update(updates)
        .eq('id', sessionId)
        .eq('mentee_id', user.id);

      if (error) {
        console.error('Error updating session:', error);
        toast({
          title: "Error",
          description: "Failed to update session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates }
            : session
        )
      );
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('mentee_id', user.id);

      if (error) {
        console.error('Error deleting session:', error);
        toast({
          title: "Error",
          description: "Failed to cancel session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSessions(prev => prev.filter(session => session.id !== sessionId));
      toast({
        title: "Session Cancelled",
        description: "Your session has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    loading,
    handleAddSession,
    handleUpdateSession,
    handleDeleteSession,
    refetchSessions: fetchSessions
  };
};

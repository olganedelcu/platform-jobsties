
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CoachSession {
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
  mentee_name?: string;
  mentee_email?: string;
}

export const useCoachSessions = (user: any) => {
  const [sessions, setSessions] = useState<CoachSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get all sessions where preferred_coach contains the coach's name or directly assigned to coach
      const { data: userData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
        
      if (!userData) {
        setLoading(false);
        return;
      }
      
      const coachFullName = `${userData.first_name} ${userData.last_name}`;
      
      // Fetch sessions either assigned to this coach's ID or where preferred coach matches name
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          mentee:mentee_id(
            email,
            first_name,
            last_name
          )
        `)
        .or(`coach_id.eq.${user.id},preferred_coach.eq.${coachFullName}`)
        .order('session_date', { ascending: true });

      if (error) {
        console.error('Error fetching coach sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load sessions. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Transform data to include mentee information
      const sessionsWithMenteeInfo = data?.map(session => {
        const menteeData = session.mentee as any;
        return {
          ...session,
          mentee: undefined, // Remove nested mentee object
          mentee_name: menteeData ? `${menteeData.first_name} ${menteeData.last_name}` : 'Unknown',
          mentee_email: menteeData?.email || ''
        };
      }) || [];

      setSessions(sessionsWithMenteeInfo);
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

  const handleConfirmSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .update({ 
          status: 'confirmed',
          coach_id: user.id, // Assign coach explicitly when confirming
          meeting_link: `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}` // Generate a simple meeting link
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error confirming session:', error);
        toast({
          title: "Error",
          description: "Failed to confirm session. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { 
                ...session, 
                status: 'confirmed',
                coach_id: user.id,
                meeting_link: `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`
              }
            : session
        )
      );

      toast({
        title: "Session Confirmed",
        description: "The session has been confirmed successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error cancelling session:', error);
        toast({
          title: "Error",
          description: "Failed to cancel session. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: "Session Cancelled",
        description: "The session has been cancelled and the mentee will be notified.",
      });
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
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

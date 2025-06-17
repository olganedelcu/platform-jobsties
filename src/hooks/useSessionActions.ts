
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Session, NewSessionData } from '@/types/sessions';
import { 
  addSession, 
  updateSession, 
  deleteSession 
} from '@/services/sessionsService';
import { FormspreeNotificationHandlers } from '@/utils/formspreeNotificationUtils';
import { supabase } from '@/integrations/supabase/client';

export const useSessionActions = (
  user: any,
  sessions: Session[],
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>
) => {
  const { toast } = useToast();

  const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  };

  const formatDateTime = (sessionDate: string) => {
    const date = new Date(sessionDate);
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const handleAddSession = async (sessionData: NewSessionData): Promise<void> => {
    if (!user) return;

    try {
      const newSession = await addSession(user.id, sessionData);
      setSessions(prev => [...prev, newSession]);
      
      toast({
        title: "Session Scheduled",
        description: `Your ${sessionData.sessionType} session has been scheduled for ${sessionData.date} at ${sessionData.time}`,
      });
    } catch (error) {
      console.error('Error adding session:', error);
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSession = async (sessionId: string, updates: Partial<Session>): Promise<void> => {
    if (!user) return;
    
    try {
      const currentSession = sessions.find(s => s.id === sessionId);
      if (!currentSession) return;

      await updateSession(user.id, sessionId, updates);

      // If the session date is being updated, send reschedule notification
      if (updates.session_date && updates.session_date !== currentSession.session_date) {
        const userProfile = await getUserProfile(user.id);
        
        if (userProfile) {
          const oldDateTime = formatDateTime(currentSession.session_date);
          const newDateTime = formatDateTime(updates.session_date);

          await FormspreeNotificationHandlers.sessionReschedule({
            menteeEmail: userProfile.email,
            menteeName: `${userProfile.first_name} ${userProfile.last_name}`,
            sessionType: currentSession.session_type,
            oldSessionDate: oldDateTime.date,
            oldSessionTime: oldDateTime.time,
            newSessionDate: newDateTime.date,
            newSessionTime: newDateTime.time,
            duration: currentSession.duration,
            notes: currentSession.notes
          });
        }
      }

      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates }
            : session
        )
      );
      
      toast({
        title: "Session Updated",
        description: "Your session has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Error",
        description: "Failed to update session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (sessionId: string): Promise<void> => {
    if (!user) return;
    
    try {
      const sessionToDelete = sessions.find(s => s.id === sessionId);
      if (!sessionToDelete) return;

      await deleteSession(user.id, sessionId);

      // Send cancellation notification
      const userProfile = await getUserProfile(user.id);
      
      if (userProfile) {
        const dateTime = formatDateTime(sessionToDelete.session_date);

        await FormspreeNotificationHandlers.sessionCancellation({
          menteeEmail: userProfile.email,
          menteeName: `${userProfile.first_name} ${userProfile.last_name}`,
          sessionType: sessionToDelete.session_type,
          sessionDate: dateTime.date,
          sessionTime: dateTime.time,
          duration: sessionToDelete.duration,
          notes: sessionToDelete.notes
        });
      }

      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: "Session Cancelled",
        description: "Your session has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to cancel session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleAddSession,
    handleUpdateSession,
    handleDeleteSession
  };
};

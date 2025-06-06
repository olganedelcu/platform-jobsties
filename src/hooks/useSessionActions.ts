
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Session, NewSessionData } from '@/types/sessions';
import { 
  addSession, 
  updateSession, 
  deleteSession 
} from '@/services/sessionsService';

export const useSessionActions = (
  user: any,
  sessions: Session[],
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>
) => {
  const { toast } = useToast();

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
      await updateSession(user.id, sessionId, updates);

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
      await deleteSession(user.id, sessionId);

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

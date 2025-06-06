
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { confirmSession, cancelSession } from '@/services/coachSessionsService';
import { CoachSession } from '@/types/coachSessions';

export const useCoachSessionActions = (
  user: any,
  sessions: CoachSession[],
  setSessions: React.Dispatch<React.SetStateAction<CoachSession[]>>
) => {
  const { toast } = useToast();

  const handleConfirmSession = async (sessionId: string): Promise<boolean> => {
    try {
      const updates = await confirmSession(sessionId, user.id);

      // Update local state
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates }
            : session
        )
      );

      toast({
        title: "Session Confirmed",
        description: "The session has been confirmed successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error confirming session:', error);
      toast({
        title: "Error",
        description: "Failed to confirm session. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCancelSession = async (sessionId: string): Promise<boolean> => {
    try {
      await cancelSession(sessionId);

      // Update local state
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: "Session Cancelled",
        description: "The session has been cancelled and the mentee will be notified.",
      });
      
      return true;
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast({
        title: "Error",
        description: "Failed to cancel session. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleConfirmSession,
    handleCancelSession
  };
};

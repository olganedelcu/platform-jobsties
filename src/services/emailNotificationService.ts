
import { supabase } from '@/integrations/supabase/client';

export interface SessionNotificationData {
  menteeEmail: string;
  menteeName: string;
  sessionType: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  notes?: string;
}

export const EmailNotificationService = {
  async sendSessionBookingNotification(sessionData: SessionNotificationData): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-session-notification', {
        body: {
          type: 'session_booked',
          data: sessionData
        }
      });

      if (error) {
        console.error('Error sending session notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send session notification:', error);
      throw error;
    }
  }
};

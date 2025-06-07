
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

export interface SessionCancellationData {
  menteeEmail: string;
  menteeName: string;
  sessionType: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  notes?: string;
}

export interface SessionRescheduleData {
  menteeEmail: string;
  menteeName: string;
  sessionType: string;
  oldSessionDate: string;
  oldSessionTime: string;
  newSessionDate: string;
  newSessionTime: string;
  duration: number;
  notes?: string;
}

export interface CourseFeedbackData {
  menteeEmail: string;
  menteeName: string;
  feedback: string;
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
  },

  async sendSessionCancellationNotification(cancellationData: SessionCancellationData): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-session-notification', {
        body: {
          type: 'session_cancelled',
          data: cancellationData
        }
      });

      if (error) {
        console.error('Error sending session cancellation notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send session cancellation notification:', error);
      throw error;
    }
  },

  async sendSessionRescheduleNotification(rescheduleData: SessionRescheduleData): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-session-notification', {
        body: {
          type: 'session_rescheduled',
          data: rescheduleData
        }
      });

      if (error) {
        console.error('Error sending session reschedule notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send session reschedule notification:', error);
      throw error;
    }
  },

  async sendCourseFeedback(feedbackData: CourseFeedbackData): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-session-notification', {
        body: {
          type: 'course_feedback',
          data: feedbackData
        }
      });

      if (error) {
        console.error('Error sending course feedback:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send course feedback:', error);
      throw error;
    }
  }
};

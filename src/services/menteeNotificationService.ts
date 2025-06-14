
import { supabase } from '@/integrations/supabase/client';

export interface MenteeNotificationData {
  menteeEmail: string;
  menteeName: string;
  actionType: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
  actionDetails: {
    jobTitle?: string;
    companyName?: string;
    fileName?: string;
    messagePreview?: string;
    todoTitle?: string;
    count?: number;
  };
}

export const MenteeNotificationService = {
  async sendJobRecommendationNotification(
    menteeEmail: string, 
    menteeName: string, 
    jobTitle: string, 
    companyName: string
  ): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-mentee-notification', {
        body: {
          menteeEmail,
          menteeName,
          actionType: 'job_recommendation',
          actionDetails: {
            jobTitle,
            companyName
          }
        }
      });

      if (error) {
        console.error('Error sending job recommendation notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send job recommendation notification:', error);
      throw error;
    }
  },

  async sendFileUploadNotification(
    menteeEmail: string, 
    menteeName: string, 
    fileName: string
  ): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-mentee-notification', {
        body: {
          menteeEmail,
          menteeName,
          actionType: 'file_upload',
          actionDetails: {
            fileName
          }
        }
      });

      if (error) {
        console.error('Error sending file upload notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send file upload notification:', error);
      throw error;
    }
  },

  async sendMessageNotification(
    menteeEmail: string, 
    menteeName: string, 
    messagePreview: string
  ): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-mentee-notification', {
        body: {
          menteeEmail,
          menteeName,
          actionType: 'message',
          actionDetails: {
            messagePreview: messagePreview.length > 100 ? 
              messagePreview.substring(0, 100) + '...' : 
              messagePreview
          }
        }
      });

      if (error) {
        console.error('Error sending message notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send message notification:', error);
      throw error;
    }
  },

  async sendTodoAssignmentNotification(
    menteeEmail: string, 
    menteeName: string, 
    todoTitle?: string,
    count?: number
  ): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-mentee-notification', {
        body: {
          menteeEmail,
          menteeName,
          actionType: 'todo_assignment',
          actionDetails: {
            todoTitle,
            count
          }
        }
      });

      if (error) {
        console.error('Error sending todo assignment notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send todo assignment notification:', error);
      throw error;
    }
  }
};

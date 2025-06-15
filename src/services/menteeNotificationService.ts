
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
    console.log("🚀 Calling job recommendation notification service:", {
      menteeEmail,
      menteeName,
      jobTitle,
      companyName
    });

    try {
      const requestBody = {
        menteeEmail,
        menteeName,
        actionType: 'job_recommendation' as const,
        actionDetails: {
          jobTitle,
          companyName
        }
      };

      console.log("📤 Sending request to edge function:", requestBody);

      const { data, error } = await supabase.functions.invoke('send-mentee-notification', {
        body: requestBody
      });

      console.log("📨 Edge function response:", { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw error;
      }

      console.log("✅ Job recommendation notification sent successfully");
    } catch (error) {
      console.error('❌ Failed to send job recommendation notification:', error);
      throw error;
    }
  },

  async sendFileUploadNotification(
    menteeEmail: string, 
    menteeName: string, 
    fileName: string
  ): Promise<void> {
    console.log("📁 Calling file upload notification service:", {
      menteeEmail,
      menteeName,
      fileName
    });

    try {
      const requestBody = {
        menteeEmail,
        menteeName,
        actionType: 'file_upload' as const,
        actionDetails: {
          fileName
        }
      };

      console.log("📤 Sending request to edge function:", requestBody);

      const { data, error } = await supabase.functions.invoke('send-mentee-notification', {
        body: requestBody
      });

      console.log("📨 Edge function response:", { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw error;
      }

      console.log("✅ File upload notification sent successfully");
    } catch (error) {
      console.error('❌ Failed to send file upload notification:', error);
      throw error;
    }
  },

  async sendMessageNotification(
    menteeEmail: string, 
    menteeName: string, 
    messagePreview: string
  ): Promise<void> {
    console.log("💬 Calling message notification service:", {
      menteeEmail,
      menteeName,
      messagePreview: messagePreview.substring(0, 50) + "..."
    });

    try {
      const requestBody = {
        menteeEmail,
        menteeName,
        actionType: 'message' as const,
        actionDetails: {
          messagePreview: messagePreview.length > 100 ? 
            messagePreview.substring(0, 100) + '...' : 
            messagePreview
        }
      };

      console.log("📤 Sending request to edge function:", requestBody);

      const { data, error } = await supabase.functions.invoke('send-mentee-notification', {
        body: requestBody
      });

      console.log("📨 Edge function response:", { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw error;
      }

      console.log("✅ Message notification sent successfully");
    } catch (error) {
      console.error('❌ Failed to send message notification:', error);
      throw error;
    }
  },

  async sendTodoAssignmentNotification(
    menteeEmail: string, 
    menteeName: string, 
    todoTitle?: string,
    count?: number
  ): Promise<void> {
    console.log("✅ Calling todo assignment notification service:", {
      menteeEmail,
      menteeName,
      todoTitle,
      count
    });

    try {
      const requestBody = {
        menteeEmail,
        menteeName,
        actionType: 'todo_assignment' as const,
        actionDetails: {
          todoTitle,
          count
        }
      };

      console.log("📤 Sending request to edge function:", requestBody);

      const { data, error } = await supabase.functions.invoke('send-mentee-notification', {
        body: requestBody
      });

      console.log("📨 Edge function response:", { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw error;
      }

      console.log("✅ Todo assignment notification sent successfully");
    } catch (error) {
      console.error('❌ Failed to send todo assignment notification:', error);
      throw error;
    }
  }
};

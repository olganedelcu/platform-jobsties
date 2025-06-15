
import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment' | 'session' | 'general';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export const InAppNotificationService = {
  async createNotification(data: CreateNotificationData): Promise<void> {
    console.log("📱 Creating in-app notification:", data);

    try {
      const { error } = await (supabase as any)
        .from('in_app_notifications')
        .insert({
          user_id: data.userId,
          title: data.title,
          message: data.message,
          type: data.type,
          action_url: data.actionUrl,
          metadata: data.metadata,
          is_read: false
        });

      if (error) {
        console.error('❌ Error creating notification:', error);
        throw error;
      }

      console.log("✅ In-app notification created successfully");
    } catch (error) {
      console.error('❌ Failed to create in-app notification:', error);
      throw error;
    }
  },

  async sendJobRecommendationNotification(
    userId: string,
    jobTitle: string,
    companyName: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      title: 'New Job Recommendation',
      message: `New job opportunity: ${jobTitle} at ${companyName}`,
      type: 'job_recommendation',
      actionUrl: '/dashboard',
      metadata: { jobTitle, companyName }
    });
  },

  async sendFileUploadNotification(
    userId: string,
    fileName: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      title: 'New File Available',
      message: `A new file has been uploaded: ${fileName}`,
      type: 'file_upload',
      actionUrl: '/dashboard',
      metadata: { fileName }
    });
  },

  async sendMessageNotification(
    userId: string,
    messagePreview: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      title: 'New Message',
      message: messagePreview.length > 100 ? 
        messagePreview.substring(0, 100) + '...' : 
        messagePreview,
      type: 'message',
      actionUrl: '/messages',
      metadata: { messagePreview }
    });
  },

  async sendTodoAssignmentNotification(
    userId: string,
    todoTitle?: string,
    count?: number
  ): Promise<void> {
    const message = count && count > 1 ? 
      `${count} new tasks have been assigned` : 
      todoTitle ? 
        `New task assigned: ${todoTitle}` : 
        'New task has been assigned';

    await this.createNotification({
      userId,
      title: 'New Task Assigned',
      message,
      type: 'todo_assignment',
      actionUrl: '/todos',
      metadata: { todoTitle, count }
    });
  },

  async sendSessionNotification(
    userId: string,
    sessionType: string,
    message: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      title: `Session ${sessionType}`,
      message,
      type: 'session',
      actionUrl: '/sessions',
      metadata: { sessionType }
    });
  }
};

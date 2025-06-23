
import { EnhancedFormspreeNotificationService } from './enhancedFormspreeNotificationService';

interface EnhancedPendingNotification {
  id: string;
  menteeId: string;
  menteeEmail: string;
  menteeName: string;
  type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
  title: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

class EnhancedBundledNotificationManager {
  private pendingNotifications: Map<string, EnhancedPendingNotification[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private readonly BUNDLE_DELAY = 30 * 60 * 1000; // 30 minutes for better user experience
  private formspreeEndpoint: string = '';

  setFormspreeEndpoint(endpoint: string) {
    this.formspreeEndpoint = endpoint;
    console.log("🔧 Enhanced Formspree endpoint configured:", endpoint);
  }

  addNotification(notification: EnhancedPendingNotification) {
    if (!this.formspreeEndpoint) {
      console.warn("⚠️ Enhanced Formspree endpoint not configured, skipping notification bundling");
      return;
    }

    const menteeId = notification.menteeId;
    
    // Add notification to pending list
    if (!this.pendingNotifications.has(menteeId)) {
      this.pendingNotifications.set(menteeId, []);
    }
    
    this.pendingNotifications.get(menteeId)?.push(notification);
    
    console.log(`📝 Enhanced notification added for ${notification.menteeName}. Total pending: ${this.pendingNotifications.get(menteeId)?.length}`);

    // Reset or create timer for this mentee
    if (this.timers.has(menteeId)) {
      clearTimeout(this.timers.get(menteeId)!);
    }

    const timer = setTimeout(() => {
      this.sendBundledNotifications(menteeId);
    }, this.BUNDLE_DELAY);

    this.timers.set(menteeId, timer);
  }

  private async sendBundledNotifications(menteeId: string) {
    const notifications = this.pendingNotifications.get(menteeId);
    
    if (!notifications || notifications.length === 0) {
      return;
    }

    const menteeInfo = notifications[0]; // Get mentee info from first notification
    
    try {
      console.log(`📤 Sending ${notifications.length} enhanced bundled notifications to ${menteeInfo.menteeName}`);
      
      await EnhancedFormspreeNotificationService.sendBundledNotifications(
        this.formspreeEndpoint,
        menteeInfo.menteeEmail,
        menteeInfo.menteeName,
        notifications.map(n => ({
          type: n.type,
          title: n.title,
          details: n.details,
          timestamp: n.timestamp,
          metadata: n.metadata
        }))
      );

      console.log(`✅ Successfully sent enhanced bundled notifications to ${menteeInfo.menteeName}`);
    } catch (error) {
      console.error(`❌ Failed to send enhanced bundled notifications to ${menteeInfo.menteeName}:`, error);
    } finally {
      // Clean up
      this.pendingNotifications.delete(menteeId);
      if (this.timers.has(menteeId)) {
        clearTimeout(this.timers.get(menteeId)!);
        this.timers.delete(menteeId);
      }
    }
  }

  // Method to immediately send pending notifications
  async flushNotifications(menteeId?: string) {
    if (menteeId) {
      await this.sendBundledNotifications(menteeId);
    } else {
      // Send all pending notifications
      const menteeIds = Array.from(this.pendingNotifications.keys());
      for (const id of menteeIds) {
        await this.sendBundledNotifications(id);
      }
    }
  }
}

// Singleton instance
export const enhancedBundledNotificationManager = new EnhancedBundledNotificationManager();

export const EnhancedBundledNotificationService = {
  configure(formspreeEndpoint: string) {
    enhancedBundledNotificationManager.setFormspreeEndpoint(formspreeEndpoint);
  },

  addJobRecommendation(menteeId: string, menteeEmail: string, menteeName: string, jobTitle: string, companyName: string) {
    enhancedBundledNotificationManager.addNotification({
      id: `job_${Date.now()}_${Math.random()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'job_recommendation',
      title: `New Job Match: ${jobTitle}`,
      details: `🏢 ${companyName} is looking for someone with your skills! This role matches your profile and career goals.`,
      timestamp: new Date().toISOString(),
      metadata: { jobTitle, companyName }
    });
  },

  addFileUpload(menteeId: string, menteeEmail: string, menteeName: string, fileName: string) {
    enhancedBundledNotificationManager.addNotification({
      id: `file_${Date.now()}_${Math.random()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'file_upload',
      title: 'New Resource Available',
      details: `📎 ${fileName} - Your mentor has shared a new resource to help with your career journey.`,
      timestamp: new Date().toISOString(),
      metadata: { fileName }
    });
  },

  addMessage(menteeId: string, menteeEmail: string, menteeName: string, messagePreview: string) {
    const truncatedMessage = messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview;
    
    enhancedBundledNotificationManager.addNotification({
      id: `message_${Date.now()}_${Math.random()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'message',
      title: 'Personal Message from Your Mentor',
      details: `💬 "${truncatedMessage}"`,
      timestamp: new Date().toISOString(),
      metadata: { messagePreview }
    });
  },

  addTodoAssignment(menteeId: string, menteeEmail: string, menteeName: string, todoTitle?: string, count?: number) {
    const title = count && count > 1 ? `${count} New Action Items` : 'New Task Assignment';
    const details = todoTitle ? 
      `🎯 ${todoTitle} - Complete this task to move forward in your job search journey.` : 
      '🎯 Your mentor has assigned you new tasks to accelerate your career progress.';

    enhancedBundledNotificationManager.addNotification({
      id: `todo_${Date.now()}_${Math.random()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'todo_assignment',
      title,
      details,
      timestamp: new Date().toISOString(),
      metadata: { todoTitle, count }
    });
  },

  async flushAllNotifications() {
    await enhancedBundledNotificationManager.flushNotifications();
  }
};

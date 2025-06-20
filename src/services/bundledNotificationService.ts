
import { FormspreeNotificationService } from './formspreeNotificationService';

interface PendingNotification {
  id: string;
  menteeId: string;
  menteeEmail: string;
  menteeName: string;
  type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
  title: string;
  details: string;
  timestamp: string;
}

class BundledNotificationManager {
  private pendingNotifications: Map<string, PendingNotification[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private readonly BUNDLE_DELAY = 30 * 1000; // 30 seconds for faster testing (was 2 hours)
  private formspreeEndpoint: string = '';

  setFormspreeEndpoint(endpoint: string) {
    this.formspreeEndpoint = endpoint;
    console.log("🔧 Formspree endpoint configured:", endpoint);
  }

  addNotification(notification: PendingNotification) {
    if (!this.formspreeEndpoint) {
      console.warn("⚠️ Formspree endpoint not configured, skipping notification bundling");
      return;
    }

    const menteeId = notification.menteeId;
    
    // Add notification to pending list
    if (!this.pendingNotifications.has(menteeId)) {
      this.pendingNotifications.set(menteeId, []);
    }
    
    this.pendingNotifications.get(menteeId)?.push(notification);
    
    console.log(`📝 Added notification for mentee ${notification.menteeName}. Total pending: ${this.pendingNotifications.get(menteeId)?.length}`);

    // Reset or create timer for this mentee
    if (this.timers.has(menteeId)) {
      clearTimeout(this.timers.get(menteeId)!);
    }

    const timer = setTimeout(() => {
      this.sendBundledNotifications(menteeId);
    }, this.BUNDLE_DELAY);

    this.timers.set(menteeId, timer);
    
    console.log(`⏰ Timer set for ${this.BUNDLE_DELAY / 1000} seconds for mentee: ${notification.menteeName}`);
  }

  private async sendBundledNotifications(menteeId: string) {
    const notifications = this.pendingNotifications.get(menteeId);
    
    if (!notifications || notifications.length === 0) {
      console.log(`⚠️ No notifications found for mentee: ${menteeId}`);
      return;
    }

    const menteeInfo = notifications[0]; // Get mentee info from first notification
    
    try {
      console.log(`📤 Sending ${notifications.length} bundled notifications to ${menteeInfo.menteeName} (${menteeInfo.menteeEmail})`);
      
      await FormspreeNotificationService.sendBundledNotifications(
        this.formspreeEndpoint,
        menteeInfo.menteeEmail,
        menteeInfo.menteeName,
        notifications.map(n => ({
          type: n.type,
          title: n.title,
          details: n.details,
          timestamp: n.timestamp
        }))
      );

      console.log(`✅ Successfully sent bundled notifications to ${menteeInfo.menteeName}`);
    } catch (error) {
      console.error(`❌ Failed to send bundled notifications to ${menteeInfo.menteeName}:`, error);
      // Retry once after 5 seconds
      setTimeout(() => {
        console.log(`🔄 Retrying notification send for ${menteeInfo.menteeName}`);
        this.sendBundledNotifications(menteeId);
      }, 5000);
    } finally {
      // Clean up
      this.pendingNotifications.delete(menteeId);
      if (this.timers.has(menteeId)) {
        clearTimeout(this.timers.get(menteeId)!);
        this.timers.delete(menteeId);
      }
    }
  }

  // Method to immediately send pending notifications (useful for testing or manual triggers)
  async flushNotifications(menteeId?: string) {
    console.log("🚀 Flushing notifications immediately...");
    if (menteeId) {
      await this.sendBundledNotifications(menteeId);
    } else {
      // Send all pending notifications
      const menteeIds = Array.from(this.pendingNotifications.keys());
      console.log(`📤 Flushing notifications for ${menteeIds.length} mentees`);
      for (const id of menteeIds) {
        await this.sendBundledNotifications(id);
      }
    }
  }

  // Get status for debugging
  getStatus() {
    const menteeIds = Array.from(this.pendingNotifications.keys());
    const status = {
      configured: !!this.formspreeEndpoint,
      pendingMentees: menteeIds.length,
      totalNotifications: menteeIds.reduce((total, id) => 
        total + (this.pendingNotifications.get(id)?.length || 0), 0
      ),
      pendingDetails: menteeIds.map(id => ({
        menteeId: id,
        notificationCount: this.pendingNotifications.get(id)?.length || 0,
        hasTimer: this.timers.has(id)
      }))
    };
    console.log("📊 Notification service status:", status);
    return status;
  }
}

// Singleton instance
export const bundledNotificationManager = new BundledNotificationManager();

export const BundledNotificationService = {
  configure(formspreeEndpoint: string) {
    bundledNotificationManager.setFormspreeEndpoint(formspreeEndpoint);
  },

  addJobRecommendation(menteeId: string, menteeEmail: string, menteeName: string, jobTitle: string, companyName: string) {
    console.log("➕ Adding job recommendation to notification bundle");
    bundledNotificationManager.addNotification({
      id: `job_${Date.now()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'job_recommendation',
      title: 'New Job Recommendation',
      details: `${jobTitle} at ${companyName}`,
      timestamp: new Date().toISOString()
    });
  },

  addFileUpload(menteeId: string, menteeEmail: string, menteeName: string, fileName: string) {
    console.log("➕ Adding file upload to notification bundle");
    bundledNotificationManager.addNotification({
      id: `file_${Date.now()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'file_upload',
      title: 'New File Uploaded',
      details: `File: ${fileName}`,
      timestamp: new Date().toISOString()
    });
  },

  addMessage(menteeId: string, menteeEmail: string, menteeName: string, messagePreview: string) {
    console.log("➕ Adding message to notification bundle");
    bundledNotificationManager.addNotification({
      id: `message_${Date.now()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'message',
      title: 'New Message',
      details: messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview,
      timestamp: new Date().toISOString()
    });
  },

  addTodoAssignment(menteeId: string, menteeEmail: string, menteeName: string, todoTitle?: string, count?: number) {
    console.log("➕ Adding todo assignment to notification bundle");
    bundledNotificationManager.addNotification({
      id: `todo_${Date.now()}`,
      menteeId,
      menteeEmail,
      menteeName,
      type: 'todo_assignment',
      title: count && count > 1 ? `${count} New Tasks Assigned` : 'New Task Assigned',
      details: todoTitle || 'Task assignment from your mentor',
      timestamp: new Date().toISOString()
    });
  },

  async flushAllNotifications() {
    await bundledNotificationManager.flushNotifications();
  },

  getStatus() {
    return bundledNotificationManager.getStatus();
  }
};

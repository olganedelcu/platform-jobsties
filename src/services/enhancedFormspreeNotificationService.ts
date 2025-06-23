
import { FormspreeNotificationService } from './formspreeNotificationService';

interface EnhancedNotificationData {
  menteeEmail: string;
  menteeName: string;
  notifications: {
    type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
    title: string;
    details: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }[];
}

export const EnhancedFormspreeNotificationService = {
  async sendBundledNotifications(
    formspreeEndpoint: string,
    menteeEmail: string, 
    menteeName: string, 
    notifications: Array<{
      type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
      title: string;
      details: string;
      timestamp: string;
      metadata?: Record<string, any>;
    }>
  ): Promise<void> {
    console.log("📧 Sending enhanced bundled notifications:", {
      menteeEmail,
      menteeName,
      notificationCount: notifications.length
    });

    try {
      const emailBody = this.generateEnhancedEmailBody(menteeName, notifications);
      const subject = this.generateDynamicSubject(notifications);
      
      const formData = new FormData();
      formData.append('email', menteeEmail);
      formData.append('name', menteeName);
      formData.append('subject', subject);
      formData.append('message', emailBody);
      formData.append('_replyto', menteeEmail);
      formData.append('_from', 'JobsTies Platform <notifications@jobsties.com>');

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Enhanced notification API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("✅ Enhanced bundled notifications sent successfully:", result);
    } catch (error) {
      console.error('❌ Failed to send enhanced bundled notifications:', error);
      throw error;
    }
  },

  generateDynamicSubject(notifications: Array<{ type: string; title: string; }>): string {
    const typeCount = notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parts = [];
    if (typeCount.job_recommendation) parts.push(`${typeCount.job_recommendation} Job${typeCount.job_recommendation > 1 ? 's' : ''}`);
    if (typeCount.message) parts.push(`${typeCount.message} Message${typeCount.message > 1 ? 's' : ''}`);
    if (typeCount.todo_assignment) parts.push(`${typeCount.todo_assignment} Task${typeCount.todo_assignment > 1 ? 's' : ''}`);
    if (typeCount.file_upload) parts.push(`${typeCount.file_upload} File${typeCount.file_upload > 1 ? 's' : ''}`);

    const summary = parts.length > 1 ? parts.slice(0, -1).join(', ') + ' & ' + parts[parts.length - 1] : parts[0];
    return `🚀 JobsTies Update: ${summary} from Your Mentor`;
  },

  generateEnhancedEmailBody(menteeName: string, notifications: Array<{
    type: string;
    title: string;
    details: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>): string {
    const notificationsByType = notifications.reduce((acc, notification) => {
      if (!acc[notification.type]) {
        acc[notification.type] = [];
      }
      acc[notification.type].push(notification);
      return acc;
    }, {} as Record<string, typeof notifications>);

    let emailBody = `Hi ${menteeName},\n\n`;
    emailBody += `Great news! You have ${notifications.length} new update${notifications.length > 1 ? 's' : ''} from your JobsTies mentor 🎉\n\n`;

    // Group notifications by type with enhanced formatting
    Object.entries(notificationsByType).forEach(([type, typeNotifications]) => {
      const typeTitle = this.getEnhancedTypeTitle(type);
      emailBody += `${typeTitle}:\n`;
      emailBody += `${'─'.repeat(50)}\n`;
      
      typeNotifications.forEach((notification, index) => {
        emailBody += `${index + 1}. ${notification.title}\n`;
        emailBody += `   📋 ${notification.details}\n`;
        emailBody += `   ⏰ ${new Date(notification.timestamp).toLocaleString()}\n\n`;
      });
    });

    emailBody += `🔗 Take Action: Log in to your JobsTies dashboard to view all details and take the next steps!\n`;
    emailBody += `   Dashboard: https://platform.jobsties.com/dashboard\n\n`;
    
    emailBody += `💡 Quick Tips:\n`;
    emailBody += `   • Check your notifications regularly for new opportunities\n`;
    emailBody += `   • Respond to your mentor's messages promptly\n`;
    emailBody += `   • Complete assigned tasks to accelerate your job search\n\n`;
    
    emailBody += `Questions? Reply to this email or message your mentor directly through the platform.\n\n`;
    emailBody += `Best of luck with your career journey!\n`;
    emailBody += `The JobsTies Team 🚀`;

    return emailBody;
  },

  getEnhancedTypeTitle(type: string): string {
    switch (type) {
      case 'job_recommendation': return '🎯 NEW JOB OPPORTUNITIES';
      case 'file_upload': return '📄 NEW RESOURCES SHARED';
      case 'message': return '💬 MESSAGES FROM YOUR MENTOR';
      case 'todo_assignment': return '✅ NEW TASKS ASSIGNED';
      default: return '📢 GENERAL UPDATES';
    }
  }
};

import { supabase } from '@/integrations/supabase/client';

interface SESNotificationData {
  menteeEmail: string;
  menteeName: string;
  notifications: {
    type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
    title: string;
    details: string;
    timestamp: string;
  }[];
}

export const AmazonSESNotificationService = {
  async sendBundledNotifications(
    menteeEmail: string, 
    menteeName: string, 
    notifications: Array<{
      type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
      title: string;
      details: string;
      timestamp: string;
    }>
  ): Promise<void> {
    console.log("📧 Sending bundled notifications via Amazon SES:", {
      menteeEmail,
      menteeName,
      notificationCount: notifications.length
    });

    if (!menteeEmail || !menteeName) {
      throw new Error('Mentee email and name are required');
    }

    try {
      const emailBody = this.generateEmailBody(menteeName, notifications);
      const subject = `JobsTies Platform Updates 🚀 - ${notifications.length} New Notification${notifications.length > 1 ? 's' : ''}`;
      
      console.log("📝 Email details:", {
        to: menteeEmail,
        subject,
        bodyLength: emailBody.length
      });
      
      const emailData = {
        from: 'JobsTies Platform <service@jobsties.com>',
        to: menteeEmail,
        subject: subject,
        html: this.generateHTMLEmailBody(menteeName, notifications),
        text: emailBody
      };

      console.log("🚀 Sending request to Amazon SES...");
      
      // Call Supabase Edge Function for Amazon SES
      const { data, error } = await supabase.functions.invoke('send-ses-notification', {
        body: emailData
      });

      if (error) {
        console.error("❌ Amazon SES error response:", error);
        throw new Error(`Amazon SES error: ${error.message}`);
      }

      console.log("✅ Bundled notifications sent successfully via Amazon SES:", data);
      
      // Additional success logging
      console.log(`📬 Email sent to ${menteeEmail} with ${notifications.length} notifications`);
    } catch (error) {
      console.error('❌ Failed to send bundled notifications via Amazon SES:', error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.stack) {
          console.error('Error stack:', error.stack);
        }
      }
      
      throw error;
    }
  },

  generateEmailBody(menteeName: string, notifications: Array<{
    type: string;
    title: string;
    details: string;
    timestamp: string;
  }>): string {
    const notificationsByType = notifications.reduce((acc, notification) => {
      if (!acc[notification.type]) {
        acc[notification.type] = [];
      }
      acc[notification.type].push(notification);
      return acc;
    }, {} as Record<string, typeof notifications>);

    let emailBody = `Hi ${menteeName},\n\n`;
    emailBody += `You have ${notifications.length} new notification${notifications.length > 1 ? 's' : ''} from your JobsTies Platform mentor:\n\n`;

    // Group notifications by type
    Object.entries(notificationsByType).forEach(([type, typeNotifications]) => {
      const typeTitle = this.getTypeTitle(type);
      emailBody += `${typeTitle}:\n`;
      emailBody += `${'='.repeat(typeTitle.length)}\n`;
      
      typeNotifications.forEach((notification, index) => {
        emailBody += `${index + 1}. ${notification.title}\n`;
        emailBody += `   ${notification.details}\n`;
        emailBody += `   Time: ${new Date(notification.timestamp).toLocaleString()}\n\n`;
      });
      
      emailBody += `\n`;
    });

    emailBody += `📱 Log in to your JobsTies Platform dashboard to view all details and take action.\n\n`;
    emailBody += `🚀 Keep up the great work on your career journey!\n\n`;
    emailBody += `Best regards,\nThe JobsTies Platform Team\n\n`;
    emailBody += `---\n`;
    emailBody += `💡 Need help? Reply to this email and Ana will assist you personally.\n`;
    emailBody += `🔗 Platform: https://jobsties.lovable.app\n`;

    return emailBody;
  },

  generateHTMLEmailBody(menteeName: string, notifications: Array<{
    type: string;
    title: string;
    details: string;
    timestamp: string;
  }>): string {
    const notificationsByType = notifications.reduce((acc, notification) => {
      if (!acc[notification.type]) {
        acc[notification.type] = [];
      }
      acc[notification.type].push(notification);
      return acc;
    }, {} as Record<string, typeof notifications>);

    let htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .notification-section { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #2563eb; }
            .notification-item { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 3px; }
            .footer { margin-top: 20px; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 JobsTies Platform Updates</h1>
                <p>You have ${notifications.length} new notification${notifications.length > 1 ? 's' : ''}</p>
            </div>
            <div class="content">
                <h2>Hi ${menteeName},</h2>
                <p>Your JobsTies Platform mentor has sent you ${notifications.length} new notification${notifications.length > 1 ? 's' : ''}:</p>
    `;

    // Group notifications by type
    Object.entries(notificationsByType).forEach(([type, typeNotifications]) => {
      const typeTitle = this.getTypeTitle(type);
      htmlBody += `
                <div class="notification-section">
                    <h3>${typeTitle}</h3>
      `;
      
      typeNotifications.forEach((notification, index) => {
        htmlBody += `
                    <div class="notification-item">
                        <strong>${notification.title}</strong><br>
                        ${notification.details}<br>
                        <small>Time: ${new Date(notification.timestamp).toLocaleString()}</small>
                    </div>
        `;
      });
      
      htmlBody += `</div>`;
    });

    htmlBody += `
                <p>
                    <a href="https://jobsties.lovable.app" class="cta-button">📱 View Dashboard</a>
                </p>
                <p>🚀 Keep up the great work on your career journey!</p>
                <p>Best regards,<br>The JobsTies Platform Team</p>
            </div>
            <div class="footer">
                💡 Need help? Reply to this email and Ana will assist you personally.<br>
                🔗 Platform: <a href="https://jobsties.lovable.app">https://jobsties.lovable.app</a>
            </div>
        </div>
    </body>
    </html>
    `;

    return htmlBody;
  },

  getTypeTitle(type: string): string {
    switch (type) {
      case 'job_recommendation': return '🔍 Job Recommendations';
      case 'file_upload': return '📄 New Files';
      case 'message': return '💬 Messages';
      case 'todo_assignment': return '✅ Task Assignments';
      default: return '📢 Notifications';
    }
  }
};


interface FormspreeNotificationData {
  menteeEmail: string;
  menteeName: string;
  notifications: {
    type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
    title: string;
    details: string;
    timestamp: string;
  }[];
}

export const FormspreeNotificationService = {
  async sendBundledNotifications(
    formspreeEndpoint: string,
    menteeEmail: string, 
    menteeName: string, 
    notifications: Array<{
      type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
      title: string;
      details: string;
      timestamp: string;
    }>
  ): Promise<void> {
    console.log("📧 Sending bundled notifications via Formspree:", {
      endpoint: formspreeEndpoint,
      menteeEmail,
      menteeName,
      notificationCount: notifications.length
    });

    if (!formspreeEndpoint) {
      throw new Error('Formspree endpoint not configured');
    }

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
      
      const formData = new FormData();
      formData.append('email', menteeEmail);
      formData.append('name', menteeName);
      formData.append('subject', subject);
      formData.append('message', emailBody);
      formData.append('_replyto', menteeEmail);
      formData.append('_from', 'JobsTies Platform <notifications@jobsties.com>');
      
      // Add additional headers for better delivery
      formData.append('_cc', 'ana@jobsties.com'); // Copy Ana for monitoring
      formData.append('_format', 'plain'); // Ensure plain text format

      console.log("🚀 Sending request to Formspree...");
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log("📡 Formspree response status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { error: 'Failed to parse error response' };
        }
        console.error("❌ Formspree error response:", errorData);
        throw new Error(`Formspree error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("✅ Bundled notifications sent successfully via Formspree:", result);
      
      // Additional success logging
      console.log(`📬 Email sent to ${menteeEmail} with ${notifications.length} notifications`);
    } catch (error) {
      console.error('❌ Failed to send bundled notifications via Formspree:', error);
      
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


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
      menteeEmail,
      menteeName,
      notificationCount: notifications.length
    });

    try {
      const emailBody = this.generateEmailBody(menteeName, notifications);
      
      const formData = new FormData();
      formData.append('email', menteeEmail);
      formData.append('name', menteeName);
      formData.append('subject', `JobsTies Platform Updates 🚀 - ${notifications.length} New Notification${notifications.length > 1 ? 's' : ''}`);
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
        throw new Error(`Formspree API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("✅ Bundled notifications sent successfully via Formspree:", result);
    } catch (error) {
      console.error('❌ Failed to send bundled notifications via Formspree:', error);
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
    emailBody += `You have ${notifications.length} new notification${notifications.length > 1 ? 's' : ''} from your JobsTies mentor:\n\n`;

    // Group notifications by type
    Object.entries(notificationsByType).forEach(([type, typeNotifications]) => {
      const typeTitle = this.getTypeTitle(type);
      emailBody += `${typeTitle}:\n`;
      
      typeNotifications.forEach((notification, index) => {
        emailBody += `${index + 1}. ${notification.title}\n`;
        emailBody += `   ${notification.details}\n`;
        emailBody += `   Time: ${new Date(notification.timestamp).toLocaleString()}\n\n`;
      });
    });

    emailBody += `Log in to your JobsTies dashboard to view all details and take action: [Dashboard Link]\n\n`;
    emailBody += `Best regards,\nThe JobsTies Team`;

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

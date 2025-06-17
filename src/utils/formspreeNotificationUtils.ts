
import { BundledNotificationService } from '@/services/bundledNotificationService';

// Helper function to check if Formspree notifications are enabled
export const isFormspreeEnabled = (): boolean => {
  // You can set this endpoint in your app configuration
  const endpoint = localStorage.getItem('formspree_endpoint');
  return !!endpoint;
};

// Helper function to get mentee details for Formspree notifications
export const getMenteeFormspreeData = async (menteeId: string) => {
  console.log("📧 Getting mentee data for JobsTies notification:", menteeId);
  
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data: mentee, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, id')
      .eq('id', menteeId)
      .single();

    if (error || !mentee) {
      console.error('❌ Error fetching mentee data for JobsTies notification:', error);
      return null;
    }

    const menteeData = {
      id: mentee.id,
      email: mentee.email,
      name: `${mentee.first_name} ${mentee.last_name}`.trim()
    };
    
    console.log("✅ Mentee data retrieved for JobsTies notification:", menteeData);
    return menteeData;
  } catch (error) {
    console.error('❌ Failed to get mentee data for JobsTies notification:', error);
    return null;
  }
};

// Notification handlers for JobsTies email integration
export const FormspreeNotificationHandlers = {
  async jobRecommendation(
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTies notifications not enabled, skipping notification");
      return;
    }

    console.log("🚀 JobsTies job recommendation notification triggered:", {
      menteeId,
      jobTitle,
      companyName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping JobsTies notification - no mentee data");
      return;
    }

    try {
      BundledNotificationService.addJobRecommendation(
        menteeData.id,
        menteeData.email,
        menteeData.name,
        jobTitle,
        companyName
      );
      console.log("✅ Job recommendation added to JobsTies notification bundle");
    } catch (error) {
      console.error('❌ JobsTies job recommendation notification error:', error);
    }
  },

  async fileUpload(
    menteeId: string, 
    fileName: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTies notifications not enabled, skipping notification");
      return;
    }

    console.log("📁 JobsTies file upload notification triggered:", {
      menteeId,
      fileName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping JobsTies notification - no mentee data");
      return;
    }

    try {
      BundledNotificationService.addFileUpload(
        menteeData.id,
        menteeData.email,
        menteeData.name,
        fileName
      );
      console.log("✅ File upload added to JobsTies notification bundle");
    } catch (error) {
      console.error('❌ JobsTies file upload notification error:', error);
    }
  },

  async message(
    menteeId: string, 
    messageContent: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTies notifications not enabled, skipping notification");
      return;
    }

    console.log("💬 JobsTies message notification triggered:", {
      menteeId,
      messagePreview: messageContent.substring(0, 50) + "..."
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping JobsTies notification - no mentee data");
      return;
    }

    try {
      BundledNotificationService.addMessage(
        menteeData.id,
        menteeData.email,
        menteeData.name,
        messageContent
      );
      console.log("✅ Message added to JobsTies notification bundle");
    } catch (error) {
      console.error('❌ JobsTies message notification error:', error);
    }
  },

  async todoAssignment(
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTies notifications not enabled, skipping notification");
      return;
    }

    console.log("✅ JobsTies todo assignment notification triggered:", {
      menteeIds,
      todoTitle,
      count
    });

    // Send notifications to all mentees
    const notificationPromises = menteeIds.map(async (menteeId) => {
      const menteeData = await getMenteeFormspreeData(menteeId);
      if (!menteeData) return;

      try {
        BundledNotificationService.addTodoAssignment(
          menteeData.id,
          menteeData.email,
          menteeData.name,
          todoTitle,
          count
        );
        console.log(`✅ Todo assignment added to JobsTies bundle for ${menteeData.name}`);
      } catch (error) {
        console.error(`❌ JobsTies todo assignment notification error for ${menteeData.name}:`, error);
      }
    });

    await Promise.all(notificationPromises);
  },

  async courseFeedback(data: {
    menteeEmail: string;
    menteeName: string;
    feedback: string;
  }) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTies notifications not enabled, skipping course feedback notification");
      return;
    }

    console.log("📝 JobsTies course feedback notification triggered:", {
      menteeEmail: data.menteeEmail,
      menteeName: data.menteeName,
      feedbackPreview: data.feedback.substring(0, 50) + "..."
    });

    try {
      const endpoint = localStorage.getItem('formspree_endpoint');
      if (!endpoint) {
        throw new Error('JobsTies notification endpoint not configured');
      }

      const formData = new FormData();
      formData.append('email', data.menteeEmail);
      formData.append('name', data.menteeName);
      formData.append('subject', 'Course Feedback Received - JobsTies Platform');
      formData.append('message', `Course feedback from ${data.menteeName}:\n\n${data.feedback}`);
      formData.append('_replyto', data.menteeEmail);
      formData.append('_from', 'JobsTies Platform <feedback@jobsties.com>');

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`JobsTies API error: ${response.status}`);
      }

      console.log("✅ Course feedback sent successfully via JobsTies Platform");
    } catch (error) {
      console.error('❌ JobsTies course feedback notification error:', error);
      throw error;
    }
  },

  async sessionReschedule(data: {
    menteeEmail: string;
    menteeName: string;
    sessionType: string;
    oldSessionDate: string;
    oldSessionTime: string;
    newSessionDate: string;
    newSessionTime: string;
    duration: number;
    notes?: string;
  }) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTies notifications not enabled, skipping session reschedule notification");
      return;
    }

    console.log("📅 JobsTies session reschedule notification triggered:", {
      menteeEmail: data.menteeEmail,
      menteeName: data.menteeName,
      sessionType: data.sessionType
    });

    try {
      const endpoint = localStorage.getItem('formspree_endpoint');
      if (!endpoint) {
        throw new Error('JobsTies notification endpoint not configured');
      }

      const message = `Your ${data.sessionType} session has been rescheduled:

OLD TIME:
Date: ${data.oldSessionDate}
Time: ${data.oldSessionTime}

NEW TIME:
Date: ${data.newSessionDate}
Time: ${data.newSessionTime}

Duration: ${data.duration} minutes
${data.notes ? `Notes: ${data.notes}` : ''}

Please update your calendar accordingly.

Best regards,
The JobsTies Team`;

      const formData = new FormData();
      formData.append('email', data.menteeEmail);
      formData.append('name', data.menteeName);
      formData.append('subject', 'Session Rescheduled - JobsTies Platform');
      formData.append('message', message);
      formData.append('_replyto', data.menteeEmail);
      formData.append('_from', 'JobsTies Platform <sessions@jobsties.com>');

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`JobsTies API error: ${response.status}`);
      }

      console.log("✅ Session reschedule notification sent successfully via JobsTies Platform");
    } catch (error) {
      console.error('❌ JobsTies session reschedule notification error:', error);
      throw error;
    }
  },

  async sessionCancellation(data: {
    menteeEmail: string;
    menteeName: string;
    sessionType: string;
    sessionDate: string;
    sessionTime: string;
    duration: number;
    notes?: string;
  }) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTies notifications not enabled, skipping session cancellation notification");
      return;
    }

    console.log("❌ JobsTies session cancellation notification triggered:", {
      menteeEmail: data.menteeEmail,
      menteeName: data.menteeName,
      sessionType: data.sessionType
    });

    try {
      const endpoint = localStorage.getItem('formspree_endpoint');
      if (!endpoint) {
        throw new Error('JobsTies notification endpoint not configured');
      }

      const message = `Your ${data.sessionType} session has been cancelled:

Date: ${data.sessionDate}
Time: ${data.sessionTime}
Duration: ${data.duration} minutes
${data.notes ? `Notes: ${data.notes}` : ''}

Please contact your mentor if you need to reschedule.

Best regards,
The JobsTies Team`;

      const formData = new FormData();
      formData.append('email', data.menteeEmail);
      formData.append('name', data.menteeName);
      formData.append('subject', 'Session Cancelled - JobsTies Platform');
      formData.append('_replyto', data.menteeEmail);
      formData.append('message', message);
      formData.append('_from', 'JobsTies Platform <sessions@jobsties.com>');

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`JobsTies API error: ${response.status}`);
      }

      console.log("✅ Session cancellation notification sent successfully via JobsTies Platform");
    } catch (error) {
      console.error('❌ JobsTies session cancellation notification error:', error);
      throw error;
    }
  }
};

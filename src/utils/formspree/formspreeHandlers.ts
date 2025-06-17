
import { BundledNotificationService } from '@/services/bundledNotificationService';
import { isFormspreeEnabled } from './formspreeConfig';
import { getMenteeFormspreeData } from './formspreMenteeData';
import { 
  sendCourseFeedbackEmail, 
  sendSessionRescheduleEmail, 
  sendSessionCancellationEmail 
} from './formspreeEmailTemplates';

// Notification handlers for JobsTiesAPI email integration
export const FormspreeNotificationHandlers = {
  async jobRecommendation(
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTiesAPI notifications not enabled, skipping notification");
      return;
    }

    console.log("🚀 JobsTiesAPI job recommendation notification triggered:", {
      menteeId,
      jobTitle,
      companyName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping JobsTiesAPI notification - no mentee data");
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
      console.log("✅ Job recommendation added to JobsTiesAPI notification bundle");
    } catch (error) {
      console.error('❌ JobsTiesAPI job recommendation notification error:', error);
    }
  },

  async fileUpload(
    menteeId: string, 
    fileName: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTiesAPI notifications not enabled, skipping notification");
      return;
    }

    console.log("📁 JobsTiesAPI file upload notification triggered:", {
      menteeId,
      fileName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping JobsTiesAPI notification - no mentee data");
      return;
    }

    try {
      BundledNotificationService.addFileUpload(
        menteeData.id,
        menteeData.email,
        menteeData.name,
        fileName
      );
      console.log("✅ File upload added to JobsTiesAPI notification bundle");
    } catch (error) {
      console.error('❌ JobsTiesAPI file upload notification error:', error);
    }
  },

  async message(
    menteeId: string, 
    messageContent: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTiesAPI notifications not enabled, skipping notification");
      return;
    }

    console.log("💬 JobsTiesAPI message notification triggered:", {
      menteeId,
      messagePreview: messageContent.substring(0, 50) + "..."
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping JobsTiesAPI notification - no mentee data");
      return;
    }

    try {
      BundledNotificationService.addMessage(
        menteeData.id,
        menteeData.email,
        menteeData.name,
        messageContent
      );
      console.log("✅ Message added to JobsTiesAPI notification bundle");
    } catch (error) {
      console.error('❌ JobsTiesAPI message notification error:', error);
    }
  },

  async todoAssignment(
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ JobsTiesAPI notifications not enabled, skipping notification");
      return;
    }

    console.log("✅ JobsTiesAPI todo assignment notification triggered:", {
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
        console.log(`✅ Todo assignment added to JobsTiesAPI bundle for ${menteeData.name}`);
      } catch (error) {
        console.error(`❌ JobsTiesAPI todo assignment notification error for ${menteeData.name}:`, error);
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
      console.log("⏭️ JobsTiesAPI notifications not enabled, skipping course feedback notification");
      return;
    }

    await sendCourseFeedbackEmail(data);
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
      console.log("⏭️ JobsTiesAPI notifications not enabled, skipping session reschedule notification");
      return;
    }

    await sendSessionRescheduleEmail(data);
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
      console.log("⏭️ JobsTiesAPI notifications not enabled, skipping session cancellation notification");
      return;
    }

    await sendSessionCancellationEmail(data);
  }
};


import { BundledNotificationService } from '@/services/bundledNotificationService';
import { InAppNotificationService } from '@/services/inAppNotificationService';
import { isFormspreeEnabled } from './formspreeConfig';
import { getMenteeFormspreeData } from './formspreMenteeData';
import { 
  sendCourseFeedbackEmail, 
  sendSessionRescheduleEmail, 
  sendSessionCancellationEmail 
} from './formspreeEmailTemplates';

// Enhanced notification handlers for JobsTies API email integration
export const FormspreeNotificationHandlers = {
  async jobRecommendation(
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    console.log("🚀 Enhanced job recommendation notification triggered:", {
      menteeId,
      jobTitle,
      companyName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping notification - no mentee data");
      return;
    }

    // Always send in-app notification
    try {
      await InAppNotificationService.sendJobRecommendationNotification(
        menteeId,
        jobTitle,
        companyName
      );
      console.log("✅ In-app job recommendation notification sent");
    } catch (error) {
      console.error('❌ In-app job recommendation notification error:', error);
    }

    // Send email notification if Formspree is enabled
    if (isFormspreeEnabled()) {
      try {
        BundledNotificationService.addJobRecommendation(
          menteeData.id,
          menteeData.email,
          menteeData.name,
          jobTitle,
          companyName
        );
        console.log("✅ Job recommendation added to email notification bundle");
      } catch (error) {
        console.error('❌ Email job recommendation notification error:', error);
      }
    }
  },

  async fileUpload(
    menteeId: string, 
    fileName: string
  ) {
    console.log("📁 Enhanced file upload notification triggered:", {
      menteeId,
      fileName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping notification - no mentee data");
      return;
    }

    // Always send in-app notification
    try {
      await InAppNotificationService.sendFileUploadNotification(
        menteeId,
        fileName
      );
      console.log("✅ In-app file upload notification sent");
    } catch (error) {
      console.error('❌ In-app file upload notification error:', error);
    }

    // Send email notification if Formspree is enabled
    if (isFormspreeEnabled()) {
      try {
        BundledNotificationService.addFileUpload(
          menteeData.id,
          menteeData.email,
          menteeData.name,
          fileName
        );
        console.log("✅ File upload added to email notification bundle");
      } catch (error) {
        console.error('❌ Email file upload notification error:', error);
      }
    }
  },

  async message(
    menteeId: string, 
    messageContent: string
  ) {
    console.log("💬 Enhanced message notification triggered:", {
      menteeId,
      messagePreview: messageContent.substring(0, 50) + "..."
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping notification - no mentee data");
      return;
    }

    // Always send in-app notification
    try {
      await InAppNotificationService.sendMessageNotification(
        menteeId,
        messageContent
      );
      console.log("✅ In-app message notification sent");
    } catch (error) {
      console.error('❌ In-app message notification error:', error);
    }

    // Send email notification if Formspree is enabled
    if (isFormspreeEnabled()) {
      try {
        BundledNotificationService.addMessage(
          menteeData.id,
          menteeData.email,
          menteeData.name,
          messageContent
        );
        console.log("✅ Message added to email notification bundle");
      } catch (error) {
        console.error('❌ Email message notification error:', error);
      }
    }
  },

  async todoAssignment(
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    console.log("✅ Enhanced todo assignment notification triggered:", {
      menteeIds,
      todoTitle,
      count
    });

    // Send notifications to all mentees
    const notificationPromises = menteeIds.map(async (menteeId) => {
      const menteeData = await getMenteeFormspreeData(menteeId);
      if (!menteeData) return;

      // Always send in-app notification
      try {
        await InAppNotificationService.sendTodoAssignmentNotification(
          menteeId,
          todoTitle,
          count
        );
        console.log(`✅ In-app todo assignment notification sent to ${menteeData.name}`);
      } catch (error) {
        console.error(`❌ In-app todo assignment notification error for ${menteeData.name}:`, error);
      }

      // Send email notification if Formspree is enabled
      if (isFormspreeEnabled()) {
        try {
          BundledNotificationService.addTodoAssignment(
            menteeData.id,
            menteeData.email,
            menteeData.name,
            todoTitle,
            count
          );
          console.log(`✅ Todo assignment added to email bundle for ${menteeData.name}`);
        } catch (error) {
          console.error(`❌ Email todo assignment notification error for ${menteeData.name}:`, error);
        }
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
      console.log("⏭️ Email notifications not enabled, skipping course feedback notification");
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
      console.log("⏭️ Email notifications not enabled, skipping session reschedule notification");
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
      console.log("⏭️ Email notifications not enabled, skipping session cancellation notification");
      return;
    }

    await sendSessionCancellationEmail(data);
  }
};

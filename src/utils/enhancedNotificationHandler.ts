
import { FormspreeNotificationHandlers } from './formspree/formspreeHandlers';

// Enhanced notification handlers that work for all users (no restrictions)
export const EnhancedNotificationHandlers = {
  async jobRecommendation(
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    console.log("🎯 Enhanced job recommendation notification:", {
      menteeId,
      jobTitle,
      companyName
    });

    try {
      await FormspreeNotificationHandlers.jobRecommendation(
        menteeId,
        jobTitle,
        companyName
      );
      console.log("✅ Enhanced job recommendation notification sent successfully");
    } catch (error) {
      console.error('❌ Enhanced job recommendation notification error:', error);
    }
  },

  async fileUpload(
    menteeId: string, 
    fileName: string
  ) {
    console.log("🎯 Enhanced file upload notification:", {
      menteeId,
      fileName
    });

    try {
      await FormspreeNotificationHandlers.fileUpload(
        menteeId,
        fileName
      );
      console.log("✅ Enhanced file upload notification sent successfully");
    } catch (error) {
      console.error('❌ Enhanced file upload notification error:', error);
    }
  },

  async message(
    menteeId: string, 
    messageContent: string
  ) {
    console.log("🎯 Enhanced message notification:", {
      menteeId,
      messagePreview: messageContent.substring(0, 50) + "..."
    });

    try {
      await FormspreeNotificationHandlers.message(
        menteeId,
        messageContent
      );
      console.log("✅ Enhanced message notification sent successfully");
    } catch (error) {
      console.error('❌ Enhanced message notification error:', error);
    }
  },

  async todoAssignment(
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    console.log("🎯 Enhanced todo assignment notification:", {
      menteeIds,
      todoTitle,
      count
    });

    try {
      await FormspreeNotificationHandlers.todoAssignment(
        menteeIds,
        todoTitle,
        count
      );
      console.log("✅ Enhanced todo assignment notifications sent successfully");
    } catch (error) {
      console.error('❌ Enhanced todo assignment notification error:', error);
    }
  }
};

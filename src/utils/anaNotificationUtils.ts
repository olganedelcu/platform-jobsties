
import { InAppNotificationService } from '@/services/inAppNotificationService';

// Helper function to check if the current user is Ana
export const isAnaUser = (userEmail?: string): boolean => {
  const isAna = userEmail === 'ana@jobsties.com';
  console.log("🔍 Ana user check:", { userEmail, isAna });
  return isAna;
};

// Helper function to get mentee details for notifications
export const getMenteeNotificationData = async (menteeId: string) => {
  console.log("📧 Getting mentee notification data for:", menteeId);
  
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data: mentee, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, id')
      .eq('id', menteeId)
      .single();

    if (error || !mentee) {
      console.error('❌ Error fetching mentee data:', error);
      return null;
    }

    const menteeData = {
      id: mentee.id,
      email: mentee.email,
      name: `${mentee.first_name} ${mentee.last_name}`.trim()
    };
    
    console.log("✅ Mentee data retrieved:", menteeData);
    return menteeData;
  } catch (error) {
    console.error('❌ Failed to get mentee notification data:', error);
    return null;
  }
};

// Notification handlers for different actions
export const NotificationHandlers = {
  async jobRecommendation(
    currentUserEmail: string,
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    console.log("🚀 Job recommendation notification triggered:", {
      currentUserEmail,
      menteeId,
      jobTitle,
      companyName
    });

    if (!isAnaUser(currentUserEmail)) {
      console.log("⏭️ Skipping notification - not Ana user");
      return;
    }

    const menteeData = await getMenteeNotificationData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping notification - no mentee data");
      return;
    }

    try {
      console.log("📤 Sending job recommendation notification...");
      await InAppNotificationService.sendJobRecommendationNotification(
        menteeData.id,
        jobTitle,
        companyName
      );
      console.log("✅ Job recommendation notification sent successfully");
    } catch (error) {
      // Silently handle errors to not disrupt the main flow
      console.error('❌ Job recommendation notification error:', error);
    }
  },

  async fileUpload(
    currentUserEmail: string,
    menteeId: string, 
    fileName: string
  ) {
    console.log("📁 File upload notification triggered:", {
      currentUserEmail,
      menteeId,
      fileName
    });

    if (!isAnaUser(currentUserEmail)) {
      console.log("⏭️ Skipping notification - not Ana user");
      return;
    }

    const menteeData = await getMenteeNotificationData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping notification - no mentee data");
      return;
    }

    try {
      console.log("📤 Sending file upload notification...");
      await InAppNotificationService.sendFileUploadNotification(
        menteeData.id,
        fileName
      );
      console.log("✅ File upload notification sent successfully");
    } catch (error) {
      // Silently handle errors to not disrupt the main flow
      console.error('❌ File upload notification error:', error);
    }
  },

  async message(
    currentUserEmail: string,
    menteeId: string, 
    messageContent: string
  ) {
    console.log("💬 Message notification triggered:", {
      currentUserEmail,
      menteeId,
      messagePreview: messageContent.substring(0, 50) + "..."
    });

    if (!isAnaUser(currentUserEmail)) {
      console.log("⏭️ Skipping notification - not Ana user");
      return;
    }

    const menteeData = await getMenteeNotificationData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping notification - no mentee data");
      return;
    }

    try {
      console.log("📤 Sending message notification...");
      await InAppNotificationService.sendMessageNotification(
        menteeData.id,
        messageContent
      );
      console.log("✅ Message notification sent successfully");
    } catch (error) {
      // Silently handle errors to not disrupt the main flow
      console.error('❌ Message notification error:', error);
    }
  },

  async todoAssignment(
    currentUserEmail: string,
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    console.log("✅ Todo assignment notification triggered:", {
      currentUserEmail,
      menteeIds,
      todoTitle,
      count
    });

    if (!isAnaUser(currentUserEmail)) {
      console.log("⏭️ Skipping notification - not Ana user");
      return;
    }

    // Send notifications to all mentees
    const notificationPromises = menteeIds.map(async (menteeId) => {
      const menteeData = await getMenteeNotificationData(menteeId);
      if (!menteeData) return;

      try {
        console.log(`📤 Sending todo assignment notification to ${menteeData.name}...`);
        await InAppNotificationService.sendTodoAssignmentNotification(
          menteeData.id,
          todoTitle,
          count
        );
        console.log(`✅ Todo assignment notification sent to ${menteeData.name}`);
      } catch (error) {
        // Silently handle errors to not disrupt the main flow
        console.error(`❌ Todo assignment notification error for ${menteeData.name}:`, error);
      }
    });

    await Promise.all(notificationPromises);
  }
};

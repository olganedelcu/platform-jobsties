
import { BundledNotificationService } from '@/services/bundledNotificationService';

// Helper function to check if Formspree notifications are enabled
export const isFormspreeEnabled = (): boolean => {
  // You can set this endpoint in your app configuration
  const endpoint = localStorage.getItem('formspree_endpoint');
  return !!endpoint;
};

// Helper function to get mentee details for Formspree notifications
export const getMenteeFormspreeData = async (menteeId: string) => {
  console.log("📧 Getting mentee data for Formspree notification:", menteeId);
  
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data: mentee, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, id')
      .eq('id', menteeId)
      .single();

    if (error || !mentee) {
      console.error('❌ Error fetching mentee data for Formspree:', error);
      return null;
    }

    const menteeData = {
      id: mentee.id,
      email: mentee.email,
      name: `${mentee.first_name} ${mentee.last_name}`.trim()
    };
    
    console.log("✅ Mentee data retrieved for Formspree:", menteeData);
    return menteeData;
  } catch (error) {
    console.error('❌ Failed to get mentee data for Formspree:', error);
    return null;
  }
};

// Notification handlers for Formspree integration
export const FormspreeNotificationHandlers = {
  async jobRecommendation(
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ Formspree not enabled, skipping notification");
      return;
    }

    console.log("🚀 Formspree job recommendation notification triggered:", {
      menteeId,
      jobTitle,
      companyName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping Formspree notification - no mentee data");
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
      console.log("✅ Job recommendation added to Formspree notification bundle");
    } catch (error) {
      console.error('❌ Formspree job recommendation notification error:', error);
    }
  },

  async fileUpload(
    menteeId: string, 
    fileName: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ Formspree not enabled, skipping notification");
      return;
    }

    console.log("📁 Formspree file upload notification triggered:", {
      menteeId,
      fileName
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping Formspree notification - no mentee data");
      return;
    }

    try {
      BundledNotificationService.addFileUpload(
        menteeData.id,
        menteeData.email,
        menteeData.name,
        fileName
      );
      console.log("✅ File upload added to Formspree notification bundle");
    } catch (error) {
      console.error('❌ Formspree file upload notification error:', error);
    }
  },

  async message(
    menteeId: string, 
    messageContent: string
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ Formspree not enabled, skipping notification");
      return;
    }

    console.log("💬 Formspree message notification triggered:", {
      menteeId,
      messagePreview: messageContent.substring(0, 50) + "..."
    });

    const menteeData = await getMenteeFormspreeData(menteeId);
    if (!menteeData) {
      console.log("⏭️ Skipping Formspree notification - no mentee data");
      return;
    }

    try {
      BundledNotificationService.addMessage(
        menteeData.id,
        menteeData.email,
        menteeData.name,
        messageContent
      );
      console.log("✅ Message added to Formspree notification bundle");
    } catch (error) {
      console.error('❌ Formspree message notification error:', error);
    }
  },

  async todoAssignment(
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    if (!isFormspreeEnabled()) {
      console.log("⏭️ Formspree not enabled, skipping notification");
      return;
    }

    console.log("✅ Formspree todo assignment notification triggered:", {
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
        console.log(`✅ Todo assignment added to Formspree bundle for ${menteeData.name}`);
      } catch (error) {
        console.error(`❌ Formspree todo assignment notification error for ${menteeData.name}:`, error);
      }
    });

    await Promise.all(notificationPromises);
  }
};

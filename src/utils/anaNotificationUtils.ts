
import { MenteeNotificationService } from '@/services/menteeNotificationService';

// Helper function to check if the current user is Ana
export const isAnaUser = (userEmail?: string): boolean => {
  return userEmail === 'ana@jobsties.com';
};

// Helper function to get mentee details for notifications
export const getMenteeNotificationData = async (menteeId: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data: mentee, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', menteeId)
      .single();

    if (error || !mentee) {
      console.error('Error fetching mentee data:', error);
      return null;
    }

    return {
      email: mentee.email,
      name: `${mentee.first_name} ${mentee.last_name}`.trim()
    };
  } catch (error) {
    console.error('Failed to get mentee notification data:', error);
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
    if (!isAnaUser(currentUserEmail)) return;

    const menteeData = await getMenteeNotificationData(menteeId);
    if (!menteeData) return;

    try {
      await MenteeNotificationService.sendJobRecommendationNotification(
        menteeData.email,
        menteeData.name,
        jobTitle,
        companyName
      );
    } catch (error) {
      // Silently handle errors to not disrupt the main flow
      console.error('Notification error:', error);
    }
  },

  async fileUpload(
    currentUserEmail: string,
    menteeId: string, 
    fileName: string
  ) {
    if (!isAnaUser(currentUserEmail)) return;

    const menteeData = await getMenteeNotificationData(menteeId);
    if (!menteeData) return;

    try {
      await MenteeNotificationService.sendFileUploadNotification(
        menteeData.email,
        menteeData.name,
        fileName
      );
    } catch (error) {
      // Silently handle errors to not disrupt the main flow
      console.error('Notification error:', error);
    }
  },

  async message(
    currentUserEmail: string,
    menteeId: string, 
    messageContent: string
  ) {
    if (!isAnaUser(currentUserEmail)) return;

    const menteeData = await getMenteeNotificationData(menteeId);
    if (!menteeData) return;

    try {
      await MenteeNotificationService.sendMessageNotification(
        menteeData.email,
        menteeData.name,
        messageContent
      );
    } catch (error) {
      // Silently handle errors to not disrupt the main flow
      console.error('Notification error:', error);
    }
  },

  async todoAssignment(
    currentUserEmail: string,
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    if (!isAnaUser(currentUserEmail)) return;

    // Send notifications to all mentees
    const notificationPromises = menteeIds.map(async (menteeId) => {
      const menteeData = await getMenteeNotificationData(menteeId);
      if (!menteeData) return;

      try {
        await MenteeNotificationService.sendTodoAssignmentNotification(
          menteeData.email,
          menteeData.name,
          todoTitle,
          count
        );
      } catch (error) {
        // Silently handle errors to not disrupt the main flow
        console.error('Notification error:', error);
      }
    });

    await Promise.all(notificationPromises);
  }
};

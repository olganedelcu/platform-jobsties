
import { isAnaUser } from './userValidationUtils';
import { getMenteeNotificationData } from './menteeDataUtils';
import { FormspreeNotificationHandlers } from './formspreeNotificationUtils';
import { InAppNotificationService } from '@/services/inAppNotificationService';
import { supabase } from '@/integrations/supabase/client';

export const handleMessageNotification = async (
  currentUserEmail: string,
  menteeId: string, 
  messageContent: string
) => {
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
    
    // Send Formspree bundled notification only
    await FormspreeNotificationHandlers.message(
      menteeData.id,
      messageContent
    );
    
    // Send in-app notification to coach
    await sendInAppNotificationToCoach(menteeData.name, messageContent);
    
    // Send email notification via Supabase edge function
    await sendEmailNotificationToCoach(menteeData.email, menteeData.name, messageContent);
    
    console.log("✅ Message notification sent successfully");
  } catch (error) {
    // Silently handle errors to not disrupt the main flow
    console.error('❌ Message notification error:', error);
  }
};

const sendInAppNotificationToCoach = async (menteeName: string, messageContent: string) => {
  try {
    // Get Ana's profile to send in-app notification
    const { data: anaProfile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'ana@jobsties.com')
      .eq('role', 'COACH')
      .single();

    if (error || !anaProfile) {
      console.log("⏭️ Could not find Ana's profile for in-app notification");
      return;
    }

    await InAppNotificationService.sendMessageNotification(
      anaProfile.id,
      `New message from ${menteeName}: ${messageContent.substring(0, 100)}`
    );

    console.log("✅ In-app notification sent to coach");
  } catch (error) {
    console.error('❌ Error sending in-app notification to coach:', error);
  }
};

const sendEmailNotificationToCoach = async (menteeEmail: string, menteeName: string, messageContent: string) => {
  try {
    const { error } = await supabase.functions.invoke('send-chat-notification', {
      body: {
        menteeEmail,
        menteeName,
        message: messageContent
      }
    });

    if (error) {
      console.error('❌ Error sending email notification:', error);
      return;
    }

    console.log("✅ Email notification sent to ana@jobsties.com");
  } catch (error) {
    console.error('❌ Error invoking email notification function:', error);
  }
};

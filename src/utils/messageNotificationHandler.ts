
import { isAnaUser } from './userValidationUtils';
import { getMenteeNotificationData } from './menteeDataUtils';
import { FormspreeNotificationHandlers } from './formspreeNotificationUtils';

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
    
    console.log("✅ Message notification sent successfully");
  } catch (error) {
    // Silently handle errors to not disrupt the main flow
    console.error('❌ Message notification error:', error);
  }
};

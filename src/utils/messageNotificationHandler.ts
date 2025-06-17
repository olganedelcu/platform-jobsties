
import { isAnaUser } from './userValidationUtils';
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

  try {
    console.log("📤 Sending message notification via Formspree...");
    
    await FormspreeNotificationHandlers.message(
      menteeId,
      messageContent
    );
    
    console.log("✅ Message notification sent successfully via Formspree");
  } catch (error) {
    console.error('❌ Message notification error:', error);
  }
};

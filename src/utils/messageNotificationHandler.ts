
import { isAnaUser } from './userValidationUtils';
import { FormspreeNotificationHandlers } from './formspree/formspreeHandlers';
import { InAppNotificationService } from '@/services/inAppNotificationService';

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
    console.log("📤 Sending message notifications...");
    
    // Send in-app notification
    await InAppNotificationService.sendMessageNotification(
      menteeId,
      messageContent
    );
    
    // Send email notification via Formspree bundling
    await FormspreeNotificationHandlers.message(
      menteeId,
      messageContent
    );
    
    console.log("✅ Message notifications sent successfully");
  } catch (error) {
    console.error('❌ Message notification error:', error);
  }
};

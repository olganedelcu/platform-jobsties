
import { isAnaUser } from './userValidationUtils';
import { getMenteeNotificationData } from './menteeDataUtils';
import { FormspreeNotificationHandlers } from './formspreeNotificationUtils';

export const handleFileUploadNotification = async (
  currentUserEmail: string,
  menteeId: string, 
  fileName: string
) => {
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
    
    // Send Formspree bundled notification only
    await FormspreeNotificationHandlers.fileUpload(
      menteeData.id,
      fileName
    );
    
    console.log("✅ File upload notification sent successfully");
  } catch (error) {
    // Silently handle errors to not disrupt the main flow
    console.error('❌ File upload notification error:', error);
  }
};

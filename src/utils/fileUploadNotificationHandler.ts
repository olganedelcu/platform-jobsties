import { isAnaUser } from './userValidationUtils';
import { FormspreeNotificationHandlers } from './formspree/formspreeHandlers';

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

  try {
    console.log("📤 Sending file upload notification via Formspree...");
    
    await FormspreeNotificationHandlers.fileUpload(
      menteeId,
      fileName
    );
    
    console.log("✅ File upload notification sent successfully via Formspree");
  } catch (error) {
    console.error('❌ File upload notification error:', error);
  }
};

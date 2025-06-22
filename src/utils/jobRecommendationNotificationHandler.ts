import { isAnaUser } from './userValidationUtils';
import { FormspreeNotificationHandlers } from './formspree/formspreeHandlers';

export const handleJobRecommendationNotification = async (
  currentUserEmail: string,
  menteeId: string, 
  jobTitle: string, 
  companyName: string
) => {
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

  try {
    console.log("📤 Sending job recommendation notification via Formspree...");
    
    await FormspreeNotificationHandlers.jobRecommendation(
      menteeId,
      jobTitle,
      companyName
    );
    
    console.log("✅ Job recommendation notification sent successfully via Formspree");
  } catch (error) {
    console.error('❌ Job recommendation notification error:', error);
  }
};

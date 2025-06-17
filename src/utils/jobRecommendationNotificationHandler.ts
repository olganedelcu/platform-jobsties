
import { isAnaUser } from './userValidationUtils';
import { getMenteeNotificationData } from './menteeDataUtils';
import { FormspreeNotificationHandlers } from './formspreeNotificationUtils';

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

  const menteeData = await getMenteeNotificationData(menteeId);
  if (!menteeData) {
    console.log("⏭️ Skipping notification - no mentee data");
    return;
  }

  try {
    console.log("📤 Sending job recommendation notification...");
    
    // Send Formspree bundled notification only
    await FormspreeNotificationHandlers.jobRecommendation(
      menteeData.id,
      jobTitle,
      companyName
    );
    
    console.log("✅ Job recommendation notification sent successfully");
  } catch (error) {
    // Silently handle errors to not disrupt the main flow
    console.error('❌ Job recommendation notification error:', error);
  }
};

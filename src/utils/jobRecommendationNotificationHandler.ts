
import { isAnaUser } from './userValidationUtils';
import { FormspreeNotificationHandlers } from './formspree/formspreeHandlers';
import { InAppNotificationService } from '@/services/inAppNotificationService';

export const handleJobRecommendationNotification = async (
  currentUserEmail: string,
  menteeId: string, 
  jobTitle: string, 
  companyName: string
) => {
  console.log("🔍 Job recommendation notification triggered:", {
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
    // Send both in-app and email notifications
    console.log("📤 Sending job recommendation notifications...");
    
    // Send in-app notification
    await InAppNotificationService.sendJobRecommendationNotification(
      menteeId,
      jobTitle,
      companyName
    );
    
    // Send email notification via Formspree bundling
    await FormspreeNotificationHandlers.jobRecommendation(
      menteeId,
      jobTitle,
      companyName
    );
    
    console.log("✅ Job recommendation notifications sent successfully");
  } catch (error) {
    console.error('❌ Job recommendation notification error:', error);
  }
};

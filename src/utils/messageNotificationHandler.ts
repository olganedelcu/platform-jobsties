
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
    console.log("🔔 Attempting to send in-app notification to Ana...");
    
    // Try multiple approaches to find Ana's profile
    const { data: anaProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role, first_name, last_name')
      .eq('email', 'ana@jobsties.com');

    console.log("👤 Ana profiles search result:", { anaProfiles, profilesError });

    if (profilesError) {
      console.error("❌ Error searching for Ana's profiles:", profilesError);
      return;
    }

    if (!anaProfiles || anaProfiles.length === 0) {
      console.log("⚠️ No profiles found for ana@jobsties.com");
      
      // Let's also check what profiles exist
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('email, role')
        .limit(10);
      
      console.log("📋 Sample profiles in database:", allProfiles);
      return;
    }

    // Find the coach profile specifically
    const anaProfile = anaProfiles.find(p => p.role === 'COACH') || anaProfiles[0];
    
    if (!anaProfile) {
      console.log("⏭️ Could not find Ana's coach profile");
      return;
    }

    console.log("✅ Found Ana's profile:", { id: anaProfile.id, email: anaProfile.email, role: anaProfile.role });

    await InAppNotificationService.sendMessageNotification(
      anaProfile.id,
      `New message from ${menteeName}: ${messageContent.substring(0, 100)}`
    );

    console.log("✅ In-app notification sent to coach successfully");
  } catch (error) {
    console.error('❌ Error sending in-app notification to coach:', error);
  }
};

const sendEmailNotificationToCoach = async (menteeEmail: string, menteeName: string, messageContent: string) => {
  try {
    console.log("📧 Sending email notification to ana@jobsties.com...");
    
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

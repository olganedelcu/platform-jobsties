
import { supabase } from '@/integrations/supabase/client';

export const chatNotificationService = {
  async sendEmailNotification(messageText: string): Promise<void> {
    try {
      // Get user details for the email
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.functions.invoke('send-chat-notification', {
        body: {
          menteeEmail: user?.email,
          menteeName: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim(),
          message: messageText.trim()
        }
      });
      console.log('Email notification sent to Ana');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't throw error as the message was still sent
    }
  }
};

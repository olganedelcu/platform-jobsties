
import { supabase } from '@/integrations/supabase/client';

export const MessageReadService = {
  async markMessagesAsRead(conversationId: string) {
    if (!conversationId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mark all messages in the conversation as read for the current user
      const { error } = await supabase
        .from('messages')
        .update({ 
          read_status: true,
          read_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id); // Don't mark own messages as read

      if (error) {
        console.error('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
    }
  }
};

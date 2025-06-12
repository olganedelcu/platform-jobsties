
import { supabase } from '@/integrations/supabase/client';

export const MessageReadService = {
  async markMessagesAsRead(conversationId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();

      const { data: updatedMessages, error: messagesError } = await supabase
        .from('messages')
        .update({ 
          read_status: true,
          read_at: now
        })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('read_status', false)
        .select('id');

      if (messagesError) {
        console.error('Error marking messages as read:', messagesError);
        return;
      }

      if (updatedMessages && updatedMessages.length > 0) {
        const messageIds = updatedMessages.map(msg => msg.id);
        
        const { error: notificationsError } = await supabase
          .from('notifications')
          .update({
            is_read: true,
            read_at: now,
            updated_at: now
          })
          .in('message_id', messageIds)
          .eq('user_id', user.id)
          .eq('is_read', false);

        if (notificationsError) {
          console.error('Error marking notifications as read:', notificationsError);
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
};


import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export const chatMessagesService = {
  async fetchMessages(userId: string, coachId: string): Promise<Message[]> {
    try {
      console.log('Fetching messages between:', userId, 'and', coachId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${coachId}),and(sender_id.eq.${coachId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      console.log('Fetched messages:', data);
      return data || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  async sendMessage(userId: string, coachId: string, messageText: string): Promise<boolean> {
    try {
      console.log('Sending message:', messageText);
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: userId,
          receiver_id: coachId,
          message: messageText.trim()
        });

      if (error) {
        throw error;
      }

      console.log('Message sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  },

  subscribeToMessages(userId: string, coachId: string, onNewMessage: (message: Message) => void) {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `or(and(sender_id.eq.${userId},receiver_id.eq.${coachId}),and(sender_id.eq.${coachId},receiver_id.eq.${userId}))`
        },
        (payload) => {
          console.log('Real-time message received:', payload);
          if (payload.eventType === 'INSERT') {
            onNewMessage(payload.new as Message);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

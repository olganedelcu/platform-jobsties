
import { supabase } from '@/integrations/supabase/client';

export const useMessagesDataService = () => {
  const getMessagesByConversationId = async (conversationId: string) => {
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_id, sender_type, content, message_type, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw messagesError;
    }

    return messagesData || [];
  };

  const getAttachmentsByMessageIds = async (messageIds: string[]) => {
    if (messageIds.length === 0) return [];

    const { data: attachments, error: attachmentsError } = await supabase
      .from('message_attachments')
      .select('*')
      .in('message_id', messageIds);

    if (attachmentsError) {
      console.error('Error fetching attachments:', attachmentsError);
      return [];
    }

    return attachments || [];
  };

  return { getMessagesByConversationId, getAttachmentsByMessageIds };
};

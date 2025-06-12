
import { useCallback } from 'react';
import { useMessagesFetch } from './useMessagesFetch';
import { useMessagesSend } from './useMessagesSend';
import { useMessagesAttachment } from './useMessagesAttachment';
import { useMessagesRealtime } from './useMessagesRealtime';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'mentee' | 'coach';
  content: string;
  message_type: 'text' | 'system';
  read_status: boolean;
  read_at: string | null;
  created_at: string;
  sender_name?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  uploaded_at: string;
}

export const useMessages = (conversationId: string | null) => {
  const {
    messages,
    loading,
    fetchMessages,
    setMessages
  } = useMessagesFetch(conversationId);

  const {
    sending,
    sendMessage
  } = useMessagesSend(conversationId, fetchMessages);

  const {
    downloadAttachment
  } = useMessagesAttachment();

  const handleMessageReceived = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  useMessagesRealtime(conversationId, handleMessageReceived);

  return {
    messages,
    loading,
    sending,
    fetchMessages,
    sendMessage,
    downloadAttachment
  };
};

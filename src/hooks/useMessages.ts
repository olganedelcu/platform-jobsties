
import { useEffect, useRef } from 'react';
import { useMessagesFetch } from './useMessagesFetch';
import { useMessagesSend } from './useMessagesSend';
import { useMessagesAttachment } from './useMessagesAttachment';
import { useMessagesRealtime } from './useMessagesRealtime';

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  sender_type: 'coach' | 'mentee';
  sender_name?: string;
  content: string;
  message_type: string;
  read_status?: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
  attachments?: MessageAttachment[];
}

export const useMessages = (conversationId: string | null) => {
  const isMountedRef = useRef(true);
  
  const {
    messages,
    loading,
    fetchMessages,
    setMessages,
    cleanup: cleanupFetch
  } = useMessagesFetch(conversationId);

  const {
    sending,
    sendMessage
  } = useMessagesSend(conversationId, fetchMessages);

  const {
    downloadAttachment
  } = useMessagesAttachment();

  // Set up realtime subscription
  useMessagesRealtime(conversationId, fetchMessages);

  // Fetch messages when conversation changes
  useEffect(() => {
    isMountedRef.current = true;
    
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanupFetch();
    };
  }, []);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    downloadAttachment
  };
};

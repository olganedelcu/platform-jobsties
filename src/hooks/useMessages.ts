
import { useState, useEffect } from 'react';
import { Message, MessageAttachment } from '@/types/messages';
import { useMessageFetcher } from '@/services/messages/messageFetchService';
import { useMessageSender } from '@/services/messages/messageSendService';
import { useAttachmentOperations } from '@/services/messages/attachmentService';

export { Message, MessageAttachment } from '@/types/messages';

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const { fetchMessages: fetchMessagesFromService } = useMessageFetcher();
  const { sendMessage: sendMessageToService } = useMessageSender();
  const { uploadAttachments, downloadAttachment } = useAttachmentOperations();

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const fetchedMessages = await fetchMessagesFromService(conversationId);
      setMessages(fetchedMessages);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!conversationId || !content.trim()) return;

    try {
      setSending(true);
      await sendMessageToService(conversationId, content, attachments, uploadAttachments);
      await fetchMessages();
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    sending,
    fetchMessages,
    sendMessage,
    downloadAttachment
  };
};


import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MessageService } from '@/services/messageService';
import { MessageReadService } from '@/services/messageReadService';
import { Message } from './useMessages';

export const useMessagesFetch = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);

      const conversation = await MessageService.fetchConversationDetails(conversationId);
      if (!conversation) return;

      const messagesData = await MessageService.fetchMessagesData(conversationId);
      const messageIds = messagesData.map(msg => msg.id);
      const attachmentsData = await MessageService.fetchAttachments(messageIds);

      const senderIds = [...new Set(messagesData.map(msg => msg.sender_id).filter(Boolean))];
      const profilesData = await MessageService.fetchProfiles(senderIds);
      const coachProfile = MessageService.getCoachProfile(conversation.coach_email, profilesData);

      const formattedMessages = MessageService.formatMessages(messagesData, attachmentsData, profilesData, coachProfile);
      setMessages(formattedMessages);

      await MessageReadService.markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    fetchMessages,
    setMessages
  };
};

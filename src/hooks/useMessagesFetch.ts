
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MessageService } from '@/services/messageService';
import { MessageReadService } from '@/services/messageReadService';
import { Message } from './useMessages';

export const useMessagesFetch = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !isMountedRef.current) return;

    try {
      setLoading(true);

      const conversation = await MessageService.fetchConversationDetails(conversationId);
      if (!conversation || !isMountedRef.current) return;

      const messagesData = await MessageService.fetchMessagesData(conversationId);
      if (!isMountedRef.current) return;

      const messageIds = messagesData.map(msg => msg.id);
      const attachmentsData = await MessageService.fetchAttachments(messageIds);
      if (!isMountedRef.current) return;

      const senderIds = [...new Set(messagesData.map(msg => msg.sender_id).filter(Boolean))];
      const profilesData = await MessageService.fetchProfiles(senderIds);
      if (!isMountedRef.current) return;

      const coachProfile = MessageService.getCoachProfile(conversation.coach_email, profilesData);

      const formattedMessages = MessageService.formatMessages(messagesData, attachmentsData, profilesData, coachProfile);
      
      if (isMountedRef.current) {
        setMessages(formattedMessages);
        await MessageReadService.markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive"
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [conversationId, toast]);

  // Update the ref when component unmounts
  const cleanup = useCallback(() => {
    isMountedRef.current = false;
  }, []);

  return {
    messages,
    loading,
    fetchMessages,
    setMessages,
    cleanup
  };
};

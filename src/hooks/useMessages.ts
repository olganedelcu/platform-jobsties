
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageService } from '@/services/messageService';
import { MessageReadService } from '@/services/messageReadService';
import { MessageAttachmentService } from '@/services/messageAttachmentService';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
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

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!conversationId || !content.trim()) return;

    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const senderType = profile?.role === 'COACH' ? 'coach' : 'mentee';

      const message = await MessageService.insertMessage(conversationId, user.id, senderType, content);

      if (attachments && attachments.length > 0) {
        try {
          await MessageAttachmentService.uploadAttachments(message.id, attachments);
        } catch (error) {
          console.error('Error uploading attachments:', error);
          toast({
            title: "Warning",
            description: "Message sent but some attachments failed to upload.",
            variant: "destructive"
          });
        }
      }

      await MessageService.updateConversationTimestamp(conversationId);
      await fetchMessages();
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const downloadAttachment = async (attachment: MessageAttachment) => {
    try {
      await MessageAttachmentService.downloadAttachment(attachment);
    } catch (error) {
      console.error('Error in downloadAttachment:', error);
      toast({
        title: "Error",
        description: "Failed to download attachment.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();

      const messagesChannel = supabase
        .channel(`messages-${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
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

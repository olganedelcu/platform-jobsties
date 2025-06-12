
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageService } from '@/services/messageService';
import { MessageAttachmentService } from '@/services/messageAttachmentService';

export const useMessagesSend = (conversationId: string | null, onMessageSent: () => void) => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

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
      await onMessageSent();
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

  return {
    sending,
    sendMessage
  };
};

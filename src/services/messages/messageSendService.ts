
import { supabase } from '@/integrations/supabase/client';
import { handleMessageNotification } from '@/utils/messageNotificationHandler';
import { useToast } from '@/hooks/use-toast';

export const useMessageSender = () => {
  const { toast } = useToast();

  const sendMessage = async (
    conversationId: string,
    content: string,
    attachments?: File[],
    uploadAttachments?: (messageId: string, files: File[]) => Promise<void>
  ) => {
    if (!conversationId || !content.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile to determine sender type
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const senderType = profile?.role === 'COACH' ? 'coach' : 'mentee';

      // Insert message without read status fields
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          sender_type: senderType,
          content: content.trim(),
          message_type: 'text'
        })
        .select()
        .single();

      if (messageError) {
        console.error('Error sending message:', messageError);
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive"
        });
        return;
      }

      // Handle file attachments if any
      if (attachments && attachments.length > 0 && uploadAttachments) {
        await uploadAttachments(message.id, attachments);
      }

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Send Formspree notification based on sender type
      if (senderType === 'coach' && user?.email) {
        // If coach sends message, notify mentee via Formspree
        const { data: conversation } = await supabase
          .from('conversations')
          .select('mentee_id')
          .eq('id', conversationId)
          .single();

        if (conversation?.mentee_id) {
          await handleMessageNotification(
            user.email,
            conversation.mentee_id,
            content.trim()
          );
        }
      }

      return message;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    }
  };

  return { sendMessage };
};

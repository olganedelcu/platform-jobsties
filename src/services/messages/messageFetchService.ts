
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messages';
import { useToast } from '@/hooks/use-toast';

export const useMessageFetcher = () => {
  const { toast } = useToast();

  const fetchMessages = async (conversationId: string): Promise<Message[]> => {
    if (!conversationId) return [];

    try {
      // First, get conversation details to know coach_email
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('coach_email')
        .eq('id', conversationId)
        .single();

      if (conversationError) {
        console.error('Error fetching conversation:', conversationError);
        return [];
      }

      // Fetch the messages without read status fields
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, sender_type, content, message_type, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive"
        });
        return [];
      }

      // Then fetch the attachments for all messages
      const messageIds = messagesData?.map(msg => msg.id) || [];
      let attachmentsData = [];
      
      if (messageIds.length > 0) {
        const { data: attachments, error: attachmentsError } = await supabase
          .from('message_attachments')
          .select('*')
          .in('message_id', messageIds);

        if (!attachmentsError) {
          attachmentsData = attachments || [];
        }
      }

      // Get profiles for mentees and coach
      const senderIds = [...new Set(messagesData?.map(msg => msg.sender_id).filter(Boolean))];
      let profilesData = [];
      let coachProfile = null;

      if (senderIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, role')
          .in('id', senderIds);

        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Get coach profile by email if coach_email exists
      if (conversation.coach_email) {
        const { data: coach, error: coachError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, role')
          .eq('email', conversation.coach_email)
          .eq('role', 'COACH')
          .single();

        if (!coachError && coach) {
          coachProfile = coach;
        }
      }

      // Combine the data
      const formattedMessages = (messagesData || []).map((msg: any) => {
        let senderName = 'Unknown';
        
        if (msg.sender_type === 'coach' && coachProfile) {
          senderName = `${coachProfile.first_name} ${coachProfile.last_name}`;
        } else {
          const profile = profilesData.find(p => p.id === msg.sender_id);
          if (profile) {
            senderName = `${profile.first_name} ${profile.last_name}`;
          }
        }

        const messageAttachments = attachmentsData.filter(att => att.message_id === msg.id);

        return {
          ...msg,
          sender_name: senderName,
          attachments: messageAttachments
        };
      });

      return formattedMessages;
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive"
      });
      return [];
    }
  };

  return { fetchMessages };
};

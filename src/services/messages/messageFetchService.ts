
import { Message } from '@/types/messages';
import { useToast } from '@/hooks/use-toast';
import { useConversationDataService } from './conversationDataService';
import { useProfilesDataService } from './profilesDataService';
import { useMessagesDataService } from './messagesDataService';
import { useMessageFormattingService } from './messageFormattingService';

export const useMessageFetcher = () => {
  const { toast } = useToast();
  const { getConversationDetails } = useConversationDataService();
  const { getProfilesBySenderIds, getCoachProfile } = useProfilesDataService();
  const { getMessagesByConversationId, getAttachmentsByMessageIds } = useMessagesDataService();
  const { formatMessages } = useMessageFormattingService();

  const fetchMessages = async (conversationId: string): Promise<Message[]> => {
    if (!conversationId) return [];

    try {
      // Get conversation details to know coach_email
      const conversation = await getConversationDetails(conversationId);
      if (!conversation) return [];

      // Fetch the messages
      const messagesData = await getMessagesByConversationId(conversationId);

      // Get attachments for all messages
      const messageIds = messagesData.map(msg => msg.id);
      const attachmentsData = await getAttachmentsByMessageIds(messageIds);

      // Get profiles for mentees and coach
      const senderIds = [...new Set(messagesData.map(msg => msg.sender_id).filter(Boolean))];
      const profilesData = await getProfilesBySenderIds(senderIds);

      // Get coach profile by email if coach_email exists
      let coachProfile = null;
      if (conversation.coach_email) {
        coachProfile = await getCoachProfile(conversation.coach_email);
      }

      // Format and combine the data
      const formattedMessages = formatMessages(messagesData, profilesData, coachProfile, attachmentsData);

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

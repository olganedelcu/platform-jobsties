
import { Message } from '@/types/messages';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}

interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  uploaded_at: string;
}

interface RawMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'mentee' | 'coach';
  content: string;
  message_type: 'text' | 'system';
  created_at: string;
}

export const useMessageFormattingService = () => {
  const formatMessages = (
    messagesData: RawMessage[],
    profilesData: Profile[],
    coachProfile: Profile | null,
    attachmentsData: MessageAttachment[]
  ): Message[] => {
    return messagesData.map((msg: RawMessage) => {
      let senderName = 'Unknown';
      
      if (msg.sender_type === 'coach' && coachProfile) {
        senderName = `${coachProfile.first_name} ${coachProfile.last_name}`;
      } else {
        const profile = profilesData.find(p => p.id === msg.sender_id);
        if (profile) {
          senderName = `${profile.first_name} ${profile.last_name}`;
        }
      }

      // Get attachments for this message
      const messageAttachments = attachmentsData.filter(att => att.message_id === msg.id);

      return {
        ...msg,
        sender_name: senderName,
        attachments: messageAttachments || [] // Ensure attachments is always an array
      };
    });
  };

  return { formatMessages };
};

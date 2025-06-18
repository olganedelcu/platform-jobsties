
import { Message } from '@/types/messages';

export const useMessageFormattingService = () => {
  const formatMessages = (
    messagesData: any[],
    profilesData: any[],
    coachProfile: any,
    attachmentsData: any[]
  ): Message[] => {
    return messagesData.map((msg: any) => {
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

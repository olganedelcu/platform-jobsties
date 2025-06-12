
import { useToast } from '@/hooks/use-toast';
import { MessageAttachmentService } from '@/services/messageAttachmentService';
import { MessageAttachment } from './useMessages';

export const useMessagesAttachment = () => {
  const { toast } = useToast();

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

  return {
    downloadAttachment
  };
};

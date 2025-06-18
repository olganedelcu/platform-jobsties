
import { supabase } from '@/integrations/supabase/client';
import { MessageAttachment } from '@/types/messages';
import { useToast } from '@/hooks/use-toast';
import { useStorageService } from './storageService';

export const useAttachmentOperations = () => {
  const { toast } = useToast();
  const { ensureMessageAttachmentsBucket } = useStorageService();

  const uploadAttachments = async (messageId: string, files: File[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ensure the bucket exists
      await ensureMessageAttachmentsBucket();

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message-attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          throw uploadError;
        }

        // Save attachment record
        const { error: attachmentError } = await supabase
          .from('message_attachments')
          .insert({
            message_id: messageId,
            file_name: file.name,
            file_path: uploadData.path,
            file_type: file.type,
            file_size: file.size
          });

        if (attachmentError) {
          console.error('Error saving attachment record:', attachmentError);
          throw attachmentError;
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading attachments:', error);
      toast({
        title: "Warning",
        description: "Message sent but some attachments failed to upload.",
        variant: "destructive"
      });
    }
  };

  const downloadAttachment = async (attachment: MessageAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .download(attachment.file_path);

      if (error) {
        console.error('Error downloading attachment:', error);
        toast({
          title: "Error",
          description: "Failed to download attachment.",
          variant: "destructive"
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error in downloadAttachment:', error);
    }
  };

  return {
    uploadAttachments,
    downloadAttachment
  };
};

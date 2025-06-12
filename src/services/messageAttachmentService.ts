
import { supabase } from '@/integrations/supabase/client';
import { MessageAttachment } from '@/hooks/useMessages';

export const MessageAttachmentService = {
  async uploadAttachments(messageId: string, files: File[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

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
  },

  async downloadAttachment(attachment: MessageAttachment) {
    const { data, error } = await supabase.storage
      .from('message-attachments')
      .download(attachment.file_path);

    if (error) {
      console.error('Error downloading attachment:', error);
      throw error;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

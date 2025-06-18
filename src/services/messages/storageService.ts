
import { supabase } from '@/integrations/supabase/client';

export const useStorageService = () => {
  const ensureMessageAttachmentsBucket = async () => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.id === 'message-attachments');
      
      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket('message-attachments', {
          public: false,
          allowedMimeTypes: ['image/*', 'application/*', 'text/*'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (error) {
          console.error('Error creating message-attachments bucket:', error);
        } else {
          console.log('Created message-attachments bucket successfully');
        }
      }
    } catch (error) {
      console.error('Error ensuring message-attachments bucket:', error);
    }
  };

  return { ensureMessageAttachmentsBucket };
};

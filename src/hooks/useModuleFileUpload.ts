
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NotificationHandlers } from '@/utils/anaNotificationUtils';

type ModuleType = 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation';

export const useModuleFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadModuleFile = async (
    file: File,
    menteeId: string,
    moduleType: ModuleType
  ): Promise<boolean> => {
    if (!file || !menteeId || !moduleType) {
      toast({
        title: "Error",
        description: "Please select a file, mentee, and module.",
        variant: "destructive"
      });
      return false;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a PDF, DOC, DOCX, or TXT file only.",
        variant: "destructive"
      });
      return false;
    }

    setUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `module-files/${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('module-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Save file record to database - use file_url instead of file_path
      const { error: dbError } = await supabase
        .from('module_files')
        .insert({
          mentee_id: menteeId,
          coach_id: user.id,
          module_type: moduleType,
          file_name: file.name,
          file_url: filePath, // Changed from file_path to file_url
          file_size: file.size
        });

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('module-files')
          .remove([filePath]);
        throw dbError;
      }

      toast({
        title: "Success",
        description: `Module file uploaded successfully.`,
      });

      // Send notification if Ana uploaded the file
      if (user?.email) {
        await NotificationHandlers.fileUpload(
          user.email,
          menteeId,
          file.name
        );
      }

      return true;

    } catch (error: any) {
      console.error('Error uploading module file:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload module file.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadModuleFile
  };
};

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMentees } from '@/hooks/useMentees';

export const useModuleFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { mentees } = useMentees();

  const uploadModuleFile = async (
    file: File,
    menteeId: string,
    moduleType: 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation' | 'feedback'
  ) => {
    if (!file || !menteeId) {
      toast({
        title: "Error",
        description: "Please select a mentee and file to upload.",
        variant: "destructive"
      });
      return false;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      return false;
    }

    setUploading(true);

    try {
      // Get current user (coach)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique file name
      const fileExt = 'pdf';
      const fileName = `${moduleType}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading module file to path:', filePath);

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('module-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Module file uploaded successfully to storage');

      // Save module file record to database
      const { error: dbError } = await supabase
        .from('module_files')
        .insert({
          mentee_id: menteeId,
          coach_id: user.id,
          module_type: moduleType,
          file_name: file.name,
          file_url: filePath,
          file_size: file.size
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // If database insert fails, clean up the uploaded file
        await supabase.storage
          .from('module-files')
          .remove([filePath]);
        throw dbError;
      }

      console.log('Module file record saved to database');

      const mentee = mentees.find(m => m.id === menteeId);
      
      toast({
        title: "Success",
        description: `Module file uploaded successfully for ${mentee?.first_name} ${mentee?.last_name}`,
      });

      return true;
    } catch (error: any) {
      console.error('Upload error:', error);
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

  const deleteModuleFile = async (fileId: string, filePath: string) => {
    try {
      console.log('Deleting module file:', fileId, 'at path:', filePath);

      // Delete from database
      const { error: dbError } = await supabase
        .from('module_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

      console.log('Module file record deleted from database');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('module-files')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Don't throw here as the database record is already deleted
      } else {
        console.log('Module file deleted from storage');
      }

      toast({
        title: "Success",
        description: "Module file deleted successfully.",
      });

      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete module file.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    uploading,
    uploadModuleFile,
    deleteModuleFile
  };
};

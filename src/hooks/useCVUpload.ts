
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMentees } from '@/hooks/useMentees';
import { useAllUploadedFiles } from '@/hooks/useAllUploadedFiles';
import { supabase } from '@/integrations/supabase/client';

export const useCVUpload = () => {
  const { toast } = useToast();
  
  const { mentees, loading: menteesLoading } = useMentees();
  const { allFiles, loading: filesLoading, fetchAllFiles } = useAllUploadedFiles();
  
  const loading = menteesLoading || filesLoading;

  const handleDeleteFile = async (fileId: string, filePath: string, fileType: 'cv' | 'module') => {
    try {
      const tableName = fileType === 'cv' ? 'cv_files' : 'module_files';
      const bucketName = fileType === 'cv' ? 'cv-files' : 'module-files';

      // Delete from database
      const { error: dbError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw dbError;
      }

      // Delete from storage using the stored file path
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) {
        // Don't throw here as the database record is already deleted
        console.warn('Storage deletion warning:', storageError);
      }

      toast({
        title: "Success",
        description: "File deleted successfully.",
      });

      // Refresh the files list
      fetchAllFiles();

    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file.",
        variant: "destructive"
      });
    }
  };

  return {
    mentees,
    allFiles,
    loading,
    handleDeleteFile
  };
};


import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMentees } from '@/hooks/useMentees';
import { useAllUploadedFiles } from '@/hooks/useAllUploadedFiles';
import { uploadCVFile } from '@/utils/cvFileOperations';
import { supabase } from '@/integrations/supabase/client';

export const useCVUpload = () => {
  const { toast } = useToast();
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const { mentees, loading: menteesLoading } = useMentees();
  const { allFiles, loading: filesLoading, fetchAllFiles } = useAllUploadedFiles();
  
  const loading = menteesLoading || filesLoading;

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    
    try {
      await uploadCVFile(
        file,
        selectedMentee,
        mentees,
        () => {
          setSelectedMentee('');
          fetchAllFiles();
        },
        toast
      );
    } finally {
      setUploadingFile(false);
    }
  };

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

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedMentee,
    setSelectedMentee,
    uploadingFile,
    mentees,
    allFiles,
    loading,
    handleFileUpload,
    handleDeleteFile
  };
};

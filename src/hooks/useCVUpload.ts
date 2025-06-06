
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMentees } from '@/hooks/useMentees';
import { useCVFiles } from '@/hooks/useCVFiles';
import { uploadCVFile, deleteCVFile } from '@/utils/cvFileOperations';

export const useCVUpload = () => {
  const { toast } = useToast();
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const { mentees, loading: menteesLoading } = useMentees();
  const { cvFiles, loading: filesLoading, fetchCVFiles } = useCVFiles();
  
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
          fetchCVFiles();
        },
        toast
      );
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteCV = async (cvId: string, filePath: string) => {
    await deleteCVFile(
      cvId, 
      filePath,
      fetchCVFiles,
      toast
    );
  };

  return {
    selectedMentee,
    setSelectedMentee,
    uploadingFile,
    mentees,
    cvFiles,
    loading,
    handleFileUpload,
    handleDeleteCV
  };
};

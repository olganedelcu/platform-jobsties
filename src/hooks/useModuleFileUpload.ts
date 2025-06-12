
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMentees } from '@/hooks/useMentees';

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const getFileExtension = (file: File): string => {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.doc')) return 'doc';
  if (name.endsWith('.docx')) return 'docx';
  if (name.endsWith('.txt')) return 'txt';
  return 'unknown';
};

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

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a PDF, DOC, DOCX, or TXT file only.",
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

      // Generate unique file name with correct extension
      const fileExt = getFileExtension(file);
      const fileName = `${moduleType}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('module-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

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
        // If database insert fails, clean up the uploaded file
        await supabase.storage
          .from('module-files')
          .remove([filePath]);
        throw dbError;
      }

      const mentee = mentees.find(m => m.id === menteeId);
      
      toast({
        title: "Success",
        description: `Module file uploaded successfully for ${mentee?.first_name} ${mentee?.last_name}`,
      });

      return true;
    } catch (error: any) {
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
      // Delete from database
      const { error: dbError } = await supabase
        .from('module_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw dbError;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('module-files')
        .remove([filePath]);

      if (storageError) {
        // Don't throw here as the database record is already deleted
      }

      toast({
        title: "Success",
        description: "Module file deleted successfully.",
      });

      return true;
    } catch (error: any) {
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

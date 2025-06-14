
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mentee } from '@/hooks/useMentees';
import { NotificationHandlers } from '@/utils/anaNotificationUtils';

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

export const uploadCVFile = async (
  file: File,
  selectedMentee: string,
  mentees: Mentee[],
  onSuccess: () => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  if (!file || !selectedMentee) {
    toast({
      title: "Error",
      description: "Please select a mentee and file to upload.",
      variant: "destructive"
    });
    return;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    toast({
      title: "Error",
      description: "Please upload a PDF, DOC, DOCX, or TXT file only.",
      variant: "destructive"
    });
    return;
  }
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate unique file name with correct extension
    const fileExt = getFileExtension(file);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('cv-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Save document record to database with the storage file path
    const { error: dbError } = await supabase
      .from('cv_files')
      .insert({
        mentee_id: selectedMentee,
        coach_id: user.id,
        file_name: file.name,
        file_url: filePath, // Store the storage path
        file_size: file.size
      });

    if (dbError) {
      // If database insert fails, clean up the uploaded file
      await supabase.storage
        .from('cv-files')
        .remove([filePath]);
      throw dbError;
    }

    const mentee = mentees.find(m => m.id === selectedMentee);
    
    toast({
      title: "Success",
      description: `Document uploaded successfully for ${mentee?.first_name} ${mentee?.last_name}`,
    });

    // Send notification if Ana uploaded the file
    if (user?.email) {
      await NotificationHandlers.fileUpload(
        user.email,
        selectedMentee,
        file.name
      );
    }

    // Call the success callback function
    onSuccess();

  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to upload document.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};

export const deleteCVFile = async (
  cvId: string, 
  filePath: string,
  onSuccess: () => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  try {
    // Delete from database
    const { error: dbError } = await supabase
      .from('cv_files')
      .delete()
      .eq('id', cvId);

    if (dbError) {
      throw dbError;
    }

    // Delete from storage using the stored file path
    const { error: storageError } = await supabase.storage
      .from('cv-files')
      .remove([filePath]);

    if (storageError) {
      // Don't throw here as the database record is already deleted
    }

    toast({
      title: "Success",
      description: "Document deleted successfully.",
    });

    // Call the success callback function
    onSuccess();

  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to delete document.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};

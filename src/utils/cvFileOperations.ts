
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mentee } from '@/hooks/useMentees';

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

  if (file.type !== 'application/pdf') {
    toast({
      title: "Error",
      description: "Please upload a PDF file only.",
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

    // Generate unique file name
    const fileExt = 'pdf';
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

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cv-files')
      .getPublicUrl(filePath);

    // Save CV record to database
    const { error: dbError } = await supabase
      .from('cv_files')
      .insert({
        mentee_id: selectedMentee,
        coach_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
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
      description: `CV uploaded successfully for ${mentee?.first_name} ${mentee?.last_name}`,
    });

    // Call the success callback function
    onSuccess();

  } catch (error: any) {
    console.error('Upload error:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to upload CV file.",
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

    // Extract file path from URL for storage deletion
    const urlParts = filePath.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const { data: { user } } = await supabase.auth.getUser();
    const storageFilePath = `${user?.id}/${fileName}`;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('cv-files')
      .remove([storageFilePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Don't throw here as the database record is already deleted
    }

    toast({
      title: "Success",
      description: "CV file deleted successfully.",
    });

    // Call the success callback function
    onSuccess();

  } catch (error: any) {
    console.error('Delete error:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete CV file.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};

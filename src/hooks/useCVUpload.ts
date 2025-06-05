
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface CVFile {
  id: string;
  mentee_id: string;
  coach_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  mentee_name?: string;
}

export const useCVUpload = () => {
  const { toast } = useToast();
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentees();
    fetchCVFiles();
  }, []);

  const fetchMentees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'MENTEE')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error fetching mentees:', error);
        toast({
          title: "Error",
          description: "Failed to fetch mentees.",
          variant: "destructive"
        });
        return;
      }

      setMentees(data || []);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentees.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCVFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('cv_files')
        .select(`
          *,
          mentee:mentee_id (
            first_name,
            last_name
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching CV files:', error);
        return;
      }

      const formattedFiles = data?.map((file: any) => ({
        ...file,
        mentee_name: file.mentee ? `${file.mentee.first_name} ${file.mentee.last_name}` : 'Unknown'
      })) || [];

      setCvFiles(formattedFiles);
    } catch (error) {
      console.error('Error fetching CV files:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
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

    setUploadingFile(true);
    
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
      setSelectedMentee('');
      
      toast({
        title: "Success",
        description: `CV uploaded successfully for ${mentee?.first_name} ${mentee?.last_name}`,
      });

      // Refresh the CV files list
      fetchCVFiles();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload CV file.",
        variant: "destructive"
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteCV = async (cvId: string, filePath: string) => {
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

      // Refresh the CV files list
      fetchCVFiles();

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete CV file.",
        variant: "destructive"
      });
    }
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

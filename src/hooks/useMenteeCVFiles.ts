
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CVFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  coach_name?: string;
}

export const useMenteeCVFiles = (userId: string) => {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCVFiles = async () => {
    try {
      setLoading(true);
      
      // Fetch CV files where mentee_id matches the current user
      const { data, error } = await supabase
        .from('cv_files')
        .select('*')
        .eq('mentee_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load CV files. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // After getting CV files, fetch coach information for each file
      const filesWithCoachInfo = await Promise.all(
        (data || []).map(async (file) => {
          // Get coach information from profiles table
          const { data: coachData, error: coachError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', file.coach_id)
            .maybeSingle();

          if (coachError && coachError.code !== 'PGRST116') {
            // Error handling without console logging
          }

          return {
            ...file,
            coach_name: coachData 
              ? `${coachData.first_name} ${coachData.last_name}` 
              : 'Ana Nedelcu' // Default to Ana Nedelcu as fallback
          };
        })
      );

      setCvFiles(filesWithCoachInfo);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      // Get the file from Supabase storage
      const { data, error } = await supabase.storage
        .from('cv-files')
        .download(filePath);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to download file. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCVFiles();
  }, [userId]);

  return {
    cvFiles,
    loading,
    handleDownload
  };
};

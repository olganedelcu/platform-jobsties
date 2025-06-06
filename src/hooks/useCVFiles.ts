
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CVFile {
  id: string;
  mentee_id: string;
  coach_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  mentee_name?: string;
}

export const useCVFiles = () => {
  const { toast } = useToast();
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCVFiles = async () => {
    try {
      setLoading(true);
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
        toast({
          title: "Error",
          description: "Failed to fetch CV files",
          variant: "destructive"
        });
        return;
      }

      const formattedFiles = data?.map((file: any) => ({
        ...file,
        mentee_name: file.mentee ? `${file.mentee.first_name} ${file.mentee.last_name}` : 'Unknown'
      })) || [];

      setCvFiles(formattedFiles);
    } catch (error) {
      console.error('Error fetching CV files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch CV files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVFiles();
  }, []);

  return { cvFiles, loading, fetchCVFiles };
};

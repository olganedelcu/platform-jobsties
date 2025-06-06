
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
  coach_name?: string;
}

export const useCVFiles = () => {
  const { toast } = useToast();
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCVFiles = async () => {
    try {
      setLoading(true);
      
      // First, get all CV files
      const { data: cvFilesData, error: cvFilesError } = await supabase
        .from('cv_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (cvFilesError) {
        console.error('Error fetching CV files:', cvFilesError);
        toast({
          title: "Error",
          description: "Failed to fetch CV files",
          variant: "destructive"
        });
        return;
      }

      // Then, for each CV file, get both mentee and coach profile information
      const formattedFiles = await Promise.all(
        cvFilesData.map(async (file: any) => {
          // Get mentee info
          const { data: menteeData, error: menteeError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', file.mentee_id)
            .single();

          if (menteeError && menteeError.code !== 'PGRST116') {
            console.error('Error fetching mentee profile:', menteeError);
          }

          // Get coach info
          const { data: coachData, error: coachError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', file.coach_id)
            .single();

          if (coachError && coachError.code !== 'PGRST116') {
            console.error('Error fetching coach profile:', coachError);
          }

          return {
            ...file,
            mentee_name: menteeData 
              ? `${menteeData.first_name} ${menteeData.last_name}` 
              : 'Unknown',
            coach_name: coachData 
              ? `${coachData.first_name} ${coachData.last_name}` 
              : 'Unknown Coach'
          };
        })
      );

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


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AllUploadedFile {
  id: string;
  mentee_id: string;
  coach_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  mentee_name?: string;
  file_type: 'cv' | 'module';
  module_type?: 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation' | 'feedback';
}

export const useAllUploadedFiles = () => {
  const { toast } = useToast();
  const [allFiles, setAllFiles] = useState<AllUploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch CV files
      const { data: cvFilesData, error: cvFilesError } = await supabase
        .from('cv_files')
        .select('*')
        .eq('coach_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (cvFilesError) {
        throw cvFilesError;
      }

      // Fetch module files
      const { data: moduleFilesData, error: moduleFilesError } = await supabase
        .from('module_files')
        .select('*')
        .eq('coach_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (moduleFilesError) {
        throw moduleFilesError;
      }

      // Get mentee information for all files
      const allMenteeIds = [
        ...(cvFilesData || []).map(file => file.mentee_id),
        ...(moduleFilesData || []).map(file => file.mentee_id)
      ];
      const uniqueMenteeIds = [...new Set(allMenteeIds)];

      const menteeNames: Record<string, string> = {};
      if (uniqueMenteeIds.length > 0) {
        const { data: menteesData, error: menteesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', uniqueMenteeIds);

        if (!menteesError && menteesData) {
          menteesData.forEach(mentee => {
            menteeNames[mentee.id] = `${mentee.first_name} ${mentee.last_name}`;
          });
        }
      }

      // Format CV files
      const formattedCVFiles: AllUploadedFile[] = (cvFilesData || []).map(file => ({
        ...file,
        file_type: 'cv' as const,
        mentee_name: menteeNames[file.mentee_id] || 'Unknown Mentee'
      }));

      // Format module files
      const formattedModuleFiles: AllUploadedFile[] = (moduleFilesData || []).map(file => ({
        ...file,
        file_type: 'module' as const,
        mentee_name: menteeNames[file.mentee_id] || 'Unknown Mentee'
      }));

      // Combine and sort by upload date
      const allFormattedFiles = [...formattedCVFiles, ...formattedModuleFiles]
        .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());

      setAllFiles(allFormattedFiles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch uploaded files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);

  return { allFiles, loading, fetchAllFiles };
};

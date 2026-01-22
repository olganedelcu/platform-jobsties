
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ModuleFile {
  id: string;
  mentee_id: string;
  coach_id: string;
  module_type: 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation' | 'feedback';
  file_name: string;
  file_url: string;
  file_size?: number;
  uploaded_at: string;
  updated_at: string;
}

interface UseModuleFilesParams {
  userId: string;
  moduleType?: 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation' | 'feedback';
}

export const useModuleFiles = ({ userId, moduleType }: UseModuleFilesParams) => {
  const [files, setFiles] = useState<ModuleFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('module_files')
        .select('*')
        .eq('mentee_id', userId)
        .order('uploaded_at', { ascending: false });
      
      if (moduleType) {
        query = query.eq('module_type', moduleType);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Type assertion to ensure module_type matches our interface
      const typedFiles = (data || []).map(file => ({
        ...file,
        module_type: file.module_type as 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation' | 'feedback'
      }));

      setFiles(typedFiles);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to load module files.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (file: ModuleFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('module-files')
        .download(file.file_url);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Downloaded ${file.file_name}`,
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to download file.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFiles();
    }
  }, [userId, moduleType]);

  return {
    files,
    loading,
    fetchFiles,
    downloadFile
  };
};

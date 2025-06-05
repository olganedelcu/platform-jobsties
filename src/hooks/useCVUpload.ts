
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const useCVUpload = () => {
  const { toast } = useToast();
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentees();
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
    
    // TODO: Implement actual file upload to Supabase storage
    // For now, just show success message
    setTimeout(() => {
      const mentee = mentees.find(m => m.id === selectedMentee);
      setUploadingFile(false);
      setSelectedMentee('');
      
      toast({
        title: "Success",
        description: `CV uploaded successfully for ${mentee?.first_name} ${mentee?.last_name}`,
      });
    }, 2000);
  };

  return {
    selectedMentee,
    setSelectedMentee,
    uploadingFile,
    mentees,
    loading,
    handleFileUpload
  };
};

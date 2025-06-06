
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export const useEducationData = (user?: any) => {
  const { toast } = useToast();
  const [educations, setEducations] = useState<Education[]>([]);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch education records from database
  useEffect(() => {
    if (user) {
      fetchEducations();
    }
  }, [user]);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('education_records')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;

      const formattedEducations = data?.map(edu => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.field_of_study,
        startDate: edu.start_date,
        endDate: edu.end_date || '',
        current: edu.is_current || false,
        description: edu.description || ''
      })) || [];

      setEducations(formattedEducations);
    } catch (error: any) {
      console.error('Error fetching education records:', error);
      toast({
        title: "Error",
        description: "Failed to load education records.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = async (education: Education) => {
    try {
      const { error } = await supabase
        .from('education_records')
        .insert({
          user_id: user.id,
          institution: education.institution,
          degree: education.degree,
          field_of_study: education.fieldOfStudy,
          start_date: education.startDate,
          end_date: education.current ? null : education.endDate,
          is_current: education.current,
          description: education.description
        });

      if (error) throw error;

      await fetchEducations(); // Refresh the list
      toast({
        title: "Education Added",
        description: "Education record has been saved to your profile.",
      });
    } catch (error: any) {
      console.error('Error adding education:', error);
      toast({
        title: "Error",
        description: "Failed to save education record.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEducations(educations.filter(edu => edu.id !== id));
      toast({
        title: "Education Deleted", 
        description: "Education has been removed from your profile.",
      });
    } catch (error: any) {
      console.error('Error deleting education:', error);
      toast({
        title: "Error",
        description: "Failed to delete education record.",
        variant: "destructive"
      });
    }
  };

  return {
    educations,
    showAddEducation,
    setShowAddEducation,
    handleAddEducation,
    handleDeleteEducation,
    loading
  };
};

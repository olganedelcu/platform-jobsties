
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export const useExperienceData = (user?: any) => {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch experiences from database
  useEffect(() => {
    if (user) {
      fetchExperiences();
    }
  }, [user]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('work_experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;

      const formattedExperiences = data?.map(exp => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        startDate: exp.start_date,
        endDate: exp.end_date || '',
        current: exp.is_current || false,
        description: exp.description || ''
      })) || [];

      setExperiences(formattedExperiences);
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      toast({
        title: "Error",
        description: "Failed to load work experiences.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async (experience: Experience) => {
    try {
      const { error } = await supabase
        .from('work_experiences')
        .insert({
          user_id: user.id,
          company: experience.company,
          position: experience.position,
          start_date: experience.startDate,
          end_date: experience.current ? null : experience.endDate,
          is_current: experience.current,
          description: experience.description
        });

      if (error) throw error;

      await fetchExperiences(); // Refresh the list
      toast({
        title: "Experience Added",
        description: "Work experience has been saved to your profile.",
      });
    } catch (error: any) {
      console.error('Error adding experience:', error);
      toast({
        title: "Error",
        description: "Failed to save work experience.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExperiences(experiences.filter(exp => exp.id !== id));
      toast({
        title: "Experience Deleted",
        description: "Work experience has been removed from your profile.",
      });
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete work experience.",
        variant: "destructive"
      });
    }
  };

  return {
    experiences,
    showAddExperience,
    setShowAddExperience,
    handleAddExperience,
    handleDeleteExperience,
    loading
  };
};

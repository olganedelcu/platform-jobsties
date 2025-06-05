
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export const useExperienceData = () => {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showAddExperience, setShowAddExperience] = useState(false);

  const handleAddExperience = (experience: Experience) => {
    setExperiences([...experiences, experience]);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    toast({
      title: "Experience Deleted",
      description: "Work experience has been removed from your profile.",
    });
  };

  return {
    experiences,
    showAddExperience,
    setShowAddExperience,
    handleAddExperience,
    handleDeleteExperience
  };
};

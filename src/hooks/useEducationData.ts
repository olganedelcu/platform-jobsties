
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export const useEducationData = () => {
  const { toast } = useToast();
  const [educations, setEducations] = useState<Education[]>([]);
  const [showAddEducation, setShowAddEducation] = useState(false);

  const handleAddEducation = (education: Education) => {
    setEducations([...educations, education]);
  };

  const handleDeleteEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
    toast({
      title: "Education Deleted", 
      description: "Education has been removed from your profile.",
    });
  };

  return {
    educations,
    showAddEducation,
    setShowAddEducation,
    handleAddEducation,
    handleDeleteEducation
  };
};

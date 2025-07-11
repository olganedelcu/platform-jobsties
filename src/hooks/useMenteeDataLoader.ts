
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMenteeDataFetcher } from './useMenteeDataFetcher';
import { useMenteeAssignment } from './useMenteeAssignment';
import { Mentee } from './useMentees';

export const useMenteeDataLoader = () => {
  const { toast } = useToast();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchAllMentees, getCurrentUser } = useMenteeDataFetcher();
  const { processAssignments } = useMenteeAssignment();

  const fetchMentees = async () => {
    try {
      setLoading(true);
      
      const user = await getCurrentUser();
      if (!user) return;

      const allMentees = await fetchAllMentees();
      
      if (allMentees.length === 0) {
        setMentees([]);
        toast({
          title: "Info",
          description: "No mentees found in the system.",
        });
        return;
      }

      const menteeData = await processAssignments(allMentees, user.id);
      setMentees(menteeData);
      console.log('Setting mentees to display:', menteeData);
      console.log('Final mentee count being set:', menteeData.length);

    } catch (error) {
      console.error('Error fetching mentees:', error);
      // Only show error toast for unexpected errors
      if (error && typeof error === 'object' && 'code' in error && error.code !== '23505') {
        toast({
          title: "Error",
          description: "Failed to fetch mentees.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    mentees,
    loading,
    fetchMentees,
    setMentees,
    setLoading
  };
};

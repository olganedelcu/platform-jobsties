
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMenteeDataFetcher } from './useMenteeDataFetcher';
import { useMenteeAssignment } from './useMenteeAssignment';

export interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const useMentees = () => {
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

  useEffect(() => {
    fetchMentees();
  }, []);

  return { mentees, loading, fetchMentees };
};

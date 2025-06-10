
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const fetchMentees = async () => {
    try {
      setLoading(true);
      
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive"
        });
        return;
      }

      // First, get the mentees assigned to this coach
      const { data: assignments, error: assignmentsError } = await supabase
        .from('coach_mentee_assignments')
        .select(`
          mentee_id,
          profiles!coach_mentee_assignments_mentee_id_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('coach_id', user.id)
        .eq('is_active', true);

      if (assignmentsError) {
        console.error('Error fetching coach assignments:', assignmentsError);
        toast({
          title: "Error",
          description: "Failed to fetch assigned mentees.",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match the Mentee interface
      const assignedMentees = assignments?.map(assignment => ({
        id: assignment.profiles.id,
        first_name: assignment.profiles.first_name,
        last_name: assignment.profiles.last_name,
        email: assignment.profiles.email
      })) || [];

      setMentees(assignedMentees);
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

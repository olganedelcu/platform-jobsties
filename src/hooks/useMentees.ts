
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

      console.log('Current user ID:', user.id);

      // Get the mentees assigned to this coach using the coach_mentee_assignments table
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

      console.log('Assignments query result:', assignments);
      console.log('Assignments error:', assignmentsError);

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

      console.log('Transformed assigned mentees:', assignedMentees);
      setMentees(assignedMentees);

      if (assignedMentees.length === 0) {
        console.log('No mentees found for this coach. Checking if there are any mentees to assign...');
        
        // Check if there are mentees in the profiles table that need to be assigned
        const { data: allMentees, error: menteesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('role', 'mentee');

        console.log('All mentees in profiles table:', allMentees);
        console.log('Mentees query error:', menteesError);

        if (allMentees && allMentees.length > 0) {
          toast({
            title: "Info",
            description: `Found ${allMentees.length} mentees in the system, but none are assigned to you. Contact your administrator.`,
          });
        }
      }
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

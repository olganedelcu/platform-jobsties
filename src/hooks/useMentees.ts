
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

      // First, get ALL mentees from the profiles table - check for both 'mentee' and 'MENTEE'
      const { data: allMentees, error: menteesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .or('role.eq.mentee,role.eq.MENTEE');

      console.log('All mentees from profiles table:', allMentees);

      if (menteesError) {
        console.error('Error fetching mentees from profiles:', menteesError);
        toast({
          title: "Error",
          description: "Failed to fetch mentees.",
          variant: "destructive"
        });
        return;
      }

      if (!allMentees || allMentees.length === 0) {
        console.log('No mentees found in profiles table');
        setMentees([]);
        toast({
          title: "Info",
          description: "No mentees found in the system.",
        });
        return;
      }

      // Get existing assignments for this coach
      const { data: existingAssignments, error: assignmentsError } = await supabase
        .from('coach_mentee_assignments')
        .select('mentee_id')
        .eq('coach_id', user.id)
        .eq('is_active', true);

      if (assignmentsError) {
        console.error('Error fetching existing assignments:', assignmentsError);
        // Continue anyway, we'll try to assign all mentees
      }

      const assignedMenteeIds = existingAssignments?.map(a => a.mentee_id) || [];
      const unassignedMentees = allMentees.filter(m => !assignedMenteeIds.includes(m.id));

      console.log('Already assigned mentee IDs:', assignedMenteeIds);
      console.log('Unassigned mentees that need assignment:', unassignedMentees);

      // If there are unassigned mentees, assign them to the current coach
      if (unassignedMentees.length > 0) {
        console.log('Assigning unassigned mentees to current coach...');
        const newAssignments = unassignedMentees.map(mentee => ({
          coach_id: user.id,
          mentee_id: mentee.id,
          is_active: true
        }));

        const { error: assignError } = await supabase
          .from('coach_mentee_assignments')
          .insert(newAssignments);

        if (assignError) {
          console.error('Error auto-assigning mentees:', assignError);
          toast({
            title: "Warning",
            description: `Could not assign ${unassignedMentees.length} mentees automatically.`,
            variant: "destructive"
          });
        } else {
          console.log('Successfully auto-assigned mentees');
          toast({
            title: "Success",
            description: `Assigned ${unassignedMentees.length} new mentees to you.`,
          });
        }
      }

      // Always show ALL mentees from profiles table
      setMentees(allMentees);
      console.log('Setting mentees to display:', allMentees);

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

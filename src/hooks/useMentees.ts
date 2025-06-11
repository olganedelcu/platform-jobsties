
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

      // First, try to get mentees assigned to this coach
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

      if (assignedMentees.length === 0) {
        console.log('No assigned mentees found. Checking for unassigned mentees...');
        
        // Get all mentees from profiles table
        const { data: allMentees, error: menteesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('role', 'mentee');

        console.log('All mentees in profiles table:', allMentees);
        console.log('Mentees query error:', menteesError);

        if (menteesError) {
          console.error('Error fetching all mentees:', menteesError);
          toast({
            title: "Error",
            description: "Failed to fetch mentees.",
            variant: "destructive"
          });
          return;
        }

        if (allMentees && allMentees.length > 0) {
          // Check which mentees are not assigned to any coach
          const { data: existingAssignments } = await supabase
            .from('coach_mentee_assignments')
            .select('mentee_id')
            .eq('is_active', true);

          const assignedMenteeIds = existingAssignments?.map(a => a.mentee_id) || [];
          const unassignedMentees = allMentees.filter(m => !assignedMenteeIds.includes(m.id));

          console.log('Assigned mentee IDs:', assignedMenteeIds);
          console.log('Unassigned mentees:', unassignedMentees);

          if (unassignedMentees.length > 0) {
            // Auto-assign unassigned mentees to current coach
            console.log('Auto-assigning unassigned mentees to current coach...');
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
              // Still set the mentees even if assignment fails
              setMentees(allMentees);
            } else {
              console.log('Successfully auto-assigned mentees');
              setMentees(allMentees);
              toast({
                title: "Success",
                description: `Assigned ${unassignedMentees.length} mentees to you.`,
              });
            }
          } else {
            setMentees(assignedMentees);
            toast({
              title: "Info",
              description: "All mentees are already assigned.",
            });
          }
        } else {
          setMentees([]);
          toast({
            title: "Info",
            description: "No mentees found in the system.",
          });
        }
      } else {
        setMentees(assignedMentees);
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

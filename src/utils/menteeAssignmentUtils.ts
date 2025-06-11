
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const assignAllMenteesToCurrentCoach = async (toast: ReturnType<typeof useToast>['toast']) => {
  try {
    console.log('Starting manual assignment of ALL mentees...');

    // Get the current authenticated user (coach)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      toast({
        title: "Error",
        description: "No authenticated coach found.",
        variant: "destructive"
      });
      return false;
    }

    console.log('Using current user as coach:', user.id);
    
    // Get ALL mentees from profiles table - check for both 'mentee' and 'MENTEE'
    const { data: allMentees, error: menteesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .or('role.eq.mentee,role.eq.MENTEE');

    if (menteesError) {
      console.error('Error fetching mentees:', menteesError);
      toast({
        title: "Error",
        description: "Failed to fetch mentees from profiles.",
        variant: "destructive"
      });
      return false;
    }

    console.log('All mentees found in profiles:', allMentees);

    if (!allMentees || allMentees.length === 0) {
      toast({
        title: "Info",
        description: "No mentees found in the profiles table.",
      });
      return true;
    }

    // Get existing assignments for this coach
    const { data: existingAssignments, error: assignmentsError } = await supabase
      .from('coach_mentee_assignments')
      .select('mentee_id')
      .eq('coach_id', user.id)
      .eq('is_active', true);

    if (assignmentsError) {
      console.error('Error fetching existing assignments:', assignmentsError);
      // Continue anyway, we'll assign all mentees
    }

    const assignedMenteeIds = existingAssignments?.map(a => a.mentee_id) || [];
    const unassignedMentees = allMentees.filter(m => !assignedMenteeIds.includes(m.id));

    console.log('Already assigned mentee IDs:', assignedMenteeIds);
    console.log('Unassigned mentees to assign:', unassignedMentees);

    if (unassignedMentees.length === 0) {
      toast({
        title: "Info",
        description: `All ${allMentees.length} mentees are already assigned to you.`,
      });
      return true;
    }

    // Create assignments for all unassigned mentees
    const assignments = unassignedMentees.map(mentee => ({
      coach_id: user.id,
      mentee_id: mentee.id,
      is_active: true
    }));

    const { error: assignmentError } = await supabase
      .from('coach_mentee_assignments')
      .insert(assignments);

    if (assignmentError) {
      console.error('Error creating assignments:', assignmentError);
      toast({
        title: "Error",
        description: "Failed to assign mentees.",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Success",
      description: `Successfully assigned ${assignments.length} mentees. Total: ${allMentees.length} mentees available.`,
    });
    return true;
  } catch (error) {
    console.error('Error in manual assignment:', error);
    toast({
      title: "Error",
      description: "Failed to assign mentees.",
      variant: "destructive"
    });
    return false;
  }
};


import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const assignAllMenteesToCurrentCoach = async (toast: ReturnType<typeof useToast>['toast']) => {
  try {
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
    
    // Get ALL mentees from profiles table - check for both 'mentee' and 'MENTEE'
    const { data: allMentees, error: menteesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .or('role.eq.mentee,role.eq.MENTEE');

    if (menteesError) {
      toast({
        title: "Error",
        description: "Failed to fetch mentees from profiles.",
        variant: "destructive"
      });
      return false;
    }

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
      // Continue anyway, we'll assign all mentees
    }

    const assignedMenteeIds = existingAssignments?.map(a => a.mentee_id) || [];
    const unassignedMentees = allMentees.filter(m => !assignedMenteeIds.includes(m.id));

    if (unassignedMentees.length === 0) {
      toast({
        title: "Info",
        description: `All ${allMentees.length} mentees are already assigned to you.`,
      });
      return true;
    }

    // Create assignments for all unassigned mentees using upsert to prevent duplicates
    const assignments = unassignedMentees.map(mentee => ({
      coach_id: user.id,
      mentee_id: mentee.id,
      is_active: true
    }));

    const { error: assignmentError } = await supabase
      .from('coach_mentee_assignments')
      .upsert(assignments, { 
        onConflict: 'coach_id,mentee_id',
        ignoreDuplicates: true 
      });

    if (assignmentError) {
      console.error('Assignment error:', assignmentError);
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
    console.error('Error in assignAllMenteesToCurrentCoach:', error);
    toast({
      title: "Error",
      description: "Failed to assign mentees.",
      variant: "destructive"
    });
    return false;
  }
};

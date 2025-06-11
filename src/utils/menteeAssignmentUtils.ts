
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const assignAllMenteesToAna = async (toast: ReturnType<typeof useToast>['toast']) => {
  try {
    console.log('Starting manual assignment of mentees to Ana...');

    // First, get Ana's coach ID
    const { data: anaProfile, error: anaError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'ana@jobsties.com')
      .eq('role', 'coach')
      .maybeSingle();

    if (anaError) {
      console.error('Error finding Ana:', anaError);
      toast({
        title: "Error",
        description: "Could not find Ana's profile.",
        variant: "destructive"
      });
      return false;
    }

    if (!anaProfile) {
      console.log('Ana not found, checking current user...');
      
      // If Ana's email doesn't match, use the current authenticated coach
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
      
      // Get all mentees not yet assigned to this coach
      const { data: unassignedMentees, error: unassignedError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'mentee')
        .not('id', 'in', 
          supabase
            .from('coach_mentee_assignments')
            .select('mentee_id')
            .eq('coach_id', user.id)
            .eq('is_active', true)
        );

      if (unassignedError) {
        console.error('Error fetching unassigned mentees:', unassignedError);
        toast({
          title: "Error",
          description: "Failed to fetch unassigned mentees.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Unassigned mentees:', unassignedMentees);

      if (!unassignedMentees || unassignedMentees.length === 0) {
        toast({
          title: "Info",
          description: "All mentees are already assigned to you.",
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
        description: `Successfully assigned ${assignments.length} mentees to you.`,
      });
      return true;
    }

    return false;
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

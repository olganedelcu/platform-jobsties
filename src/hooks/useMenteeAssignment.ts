
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mentee } from './useMentees';

export const useMenteeAssignment = () => {
  const { toast } = useToast();
  const [isAssigning, setIsAssigning] = useState(false);

  const assignUnassignedMentees = async (allMentees: any[], userId: string) => {
    try {
      // Get existing assignments for this coach
      const { data: existingAssignments, error: assignmentsError } = await supabase
        .from('coach_mentee_assignments')
        .select('mentee_id')
        .eq('coach_id', userId)
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
          coach_id: userId,
          mentee_id: mentee.id,
          is_active: true
        }));

        // Use upsert to handle potential duplicates gracefully
        const { error: assignError } = await supabase
          .from('coach_mentee_assignments')
          .upsert(newAssignments, { 
            onConflict: 'coach_id,mentee_id',
            ignoreDuplicates: true 
          });

        if (assignError) {
          console.error('Error auto-assigning mentees:', assignError);
          // Only show error if it's not a duplicate key constraint and there are actual issues
          if (assignError.code !== '23505') {
            console.error('Non-duplicate assignment error:', assignError);
            // No toast notification - handle silently
          } else {
            // This is expected - mentees are already assigned, completely silent
            console.log('Some mentees were already assigned (duplicate key constraint), which is expected behavior');
          }
        } else {
          console.log('Successfully auto-assigned mentees silently');
          // No notification whatsoever - assignments happen completely silently
        }
      }
    } catch (error) {
      console.error('Error in assignUnassignedMentees:', error);
      // No toast notifications for any errors - handle completely silently
    }
  };

  const processAssignments = async (allMentees: any[], userId: string): Promise<Mentee[]> => {
    await assignUnassignedMentees(allMentees, userId);

    // Return only the mentee data without the role field for the component
    return allMentees.map(({ id, first_name, last_name, email }) => ({
      id,
      first_name,
      last_name,
      email
    }));
  };

  return {
    processAssignments,
    isAssigning,
    setIsAssigning
  };
};


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

      // Get ALL mentees from the profiles table using case insensitive search
      const { data: allMentees, error: menteesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
        .ilike('role', 'mentee'); // Case insensitive search for 'mentee'

      console.log('All mentees from profiles table:', allMentees);

      if (menteesError) {
        console.error('Error fetching mentees from profiles:', menteesError);
        
        // If profiles query fails, let's try a different approach
        console.log('Profiles query failed, trying to fetch all profiles and filter...');
        
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, role');
          
        console.log('All profiles:', allProfiles);
        
        if (allProfilesError) {
          console.error('Error fetching all profiles:', allProfilesError);
          toast({
            title: "Error",
            description: "Failed to fetch mentees.",
            variant: "destructive"
          });
          return;
        }

        // Filter mentees manually
        const filteredMentees = (allProfiles || []).filter(profile => 
          profile.role && profile.role.toLowerCase() === 'mentee'
        );
        
        console.log('Manually filtered mentees:', filteredMentees);
        
        if (filteredMentees.length === 0) {
          console.log('No mentees found in profiles table');
          setMentees([]);
          toast({
            title: "Info",
            description: "No mentees found in the system.",
          });
          return;
        }
        
        // Use the manually filtered mentees
        const menteeData = filteredMentees.map(({ id, first_name, last_name, email }) => ({
          id,
          first_name,
          last_name,
          email
        }));

        setMentees(menteeData);
        console.log('Setting mentees from manual filter:', menteeData);
        return;
      }

      if (!allMentees || allMentees.length === 0) {
        console.log('No mentees found in profiles table');
        
        // Let's also check if there are any users in auth.users that might not have profiles
        console.log('Checking for users without profiles...');
        
        // Check coaching sessions to see if there are mentee_ids that don't have profiles
        const { data: sessionsWithMentees, error: sessionsError } = await supabase
          .from('coaching_sessions')
          .select('mentee_id')
          .not('mentee_id', 'is', null);
          
        if (!sessionsError && sessionsWithMentees && sessionsWithMentees.length > 0) {
          console.log('Found mentee IDs in coaching sessions:', sessionsWithMentees);
          
          // Try to get profile data for these mentee IDs
          const menteeIds = [...new Set(sessionsWithMentees.map(s => s.mentee_id))];
          const { data: menteeProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, role')
            .in('id', menteeIds);
            
          console.log('Profiles for mentees from sessions:', menteeProfiles);
        }
        
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
          // Only show error if it's not a duplicate key constraint
          if (assignError.code !== '23505') {
            toast({
              title: "Warning",
              description: `Could not assign ${unassignedMentees.length} mentees automatically.`,
              variant: "destructive"
            });
          } else {
            // This is expected - mentees are already assigned
            console.log('Some mentees were already assigned (duplicate key constraint), which is expected behavior');
          }
        } else {
          console.log('Successfully auto-assigned mentees');
          toast({
            title: "Success",
            description: `Assigned ${unassignedMentees.length} new mentees to you.`,
          });
        }
      }

      // Return only the mentee data without the role field for the component
      const menteeData = allMentees.map(({ id, first_name, last_name, email }) => ({
        id,
        first_name,
        last_name,
        email
      }));

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

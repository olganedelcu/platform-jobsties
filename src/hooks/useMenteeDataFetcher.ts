
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMenteeDataFetcher = () => {
  const { toast } = useToast();

  const fetchAllMentees = async () => {
    console.log('Fetching all mentees from profiles table...');
    
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
        throw new Error('Failed to fetch mentees');
      }

      // Filter mentees manually
      const filteredMentees = (allProfiles || []).filter(profile => 
        profile.role && profile.role.toLowerCase() === 'mentee'
      );
      
      console.log('Manually filtered mentees:', filteredMentees);
      
      if (filteredMentees.length === 0) {
        console.log('No mentees found in profiles table');
        return [];
      }
      
      return filteredMentees;
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
      
      return [];
    }

    return allMentees;
  };

  const getCurrentUser = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive"
      });
      return null;
    }

    console.log('Current user ID:', user.id);
    return user;
  };

  return {
    fetchAllMentees,
    getCurrentUser
  };
};

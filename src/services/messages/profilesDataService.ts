
import { supabase } from '@/integrations/supabase/client';

export const useProfilesDataService = () => {
  const getProfilesBySenderIds = async (senderIds: string[]) => {
    if (senderIds.length === 0) return [];

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('id', senderIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    return profiles || [];
  };

  const getCoachProfile = async (coachEmail: string) => {
    const { data: coach, error: coachError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('email', coachEmail)
      .eq('role', 'COACH')
      .single();

    if (coachError) {
      console.error('Error fetching coach profile:', coachError);
      return null;
    }

    return coach;
  };

  return { getProfilesBySenderIds, getCoachProfile };
};


import { supabase } from '@/integrations/supabase/client';

export const useProfilesDataService = () => {
  const getProfilesBySenderIds = async (senderIds: string[]) => {
    if (senderIds.length === 0) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('id', senderIds);

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    return data || [];
  };

  const getCoachProfile = async (coachEmail: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('email', coachEmail)
      .eq('role', 'COACH')
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

    if (error) {
      console.error('Error fetching coach profile:', error);
      return null;
    }

    return data;
  };

  return { getProfilesBySenderIds, getCoachProfile };
};

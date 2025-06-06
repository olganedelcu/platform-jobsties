
import { supabase } from '@/integrations/supabase/client';
import { Coach } from '@/types/coaches';

export const fetchCoaches = async (): Promise<Coach[]> => {
  console.log('Fetching coaches...');
  
  // First, let's see all profiles to debug
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, role');
  
  console.log('All profiles in database:', allProfiles);
  console.log('All profiles error:', allError);
  
  // Try both lowercase and uppercase role values
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, role')
    .or('role.eq.coach,role.eq.COACH')
    .order('first_name', { ascending: true });

  console.log('Coaches query result:', { data, error });

  if (error) {
    console.error('Error fetching coaches:', error);
    throw error;
  }

  return data || [];
};

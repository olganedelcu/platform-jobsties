
import { supabase } from '@/integrations/supabase/client';
import { Coach } from '@/types/coaches';

export const fetchCoaches = async (): Promise<Coach[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .eq('role', 'coach')
    .order('first_name', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

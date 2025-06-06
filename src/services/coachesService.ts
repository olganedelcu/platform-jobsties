
import { supabase } from '@/integrations/supabase/client';
import { Coach } from '@/types/coaches';

export const fetchCoaches = async (): Promise<Coach[]> => {
  console.log('Fetching coaches...');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, role')
    .eq('role', 'COACH')
    .order('first_name', { ascending: true });

  console.log('Coaches query result:', { data, error });

  if (error) {
    console.error('Error fetching coaches:', error);
    throw error;
  }

  return data || [];
};

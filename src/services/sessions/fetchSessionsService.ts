
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';

export const fetchSessions = async (userId: string): Promise<Session[]> => {
  console.log('Fetching sessions for user ID:', userId);
  
  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('mentee_id', userId)
    .order('session_date', { ascending: true });

  console.log('Sessions query result:', { data, error });

  if (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }

  console.log('Found sessions:', data?.length || 0);
  return data || [];
};

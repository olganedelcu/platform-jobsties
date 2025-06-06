
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';

export const fetchSessions = async (userId: string): Promise<Session[]> => {
  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('mentee_id', userId)
    .order('session_date', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

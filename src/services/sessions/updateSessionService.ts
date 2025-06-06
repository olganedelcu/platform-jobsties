
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';

export const updateSession = async (userId: string, sessionId: string, updates: Partial<Session>): Promise<void> => {
  const { error } = await supabase
    .from('coaching_sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('mentee_id', userId);

  if (error) {
    throw error;
  }
};

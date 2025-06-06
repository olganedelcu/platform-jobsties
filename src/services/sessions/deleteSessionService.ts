
import { supabase } from '@/integrations/supabase/client';

export const deleteSession = async (userId: string, sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('coaching_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('mentee_id', userId);

  if (error) {
    throw error;
  }
};

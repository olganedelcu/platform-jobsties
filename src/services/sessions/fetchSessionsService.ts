
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';

export const fetchSessions = async (userId: string): Promise<Session[]> => {
  console.log('Fetching sessions for user ID:', userId);
  
  const { data, error } = await supabase
    .from('coaching_sessions')
    .select(`
      *,
      mentee:profiles!coaching_sessions_mentee_id_fkey(first_name, last_name)
    `)
    .eq('mentee_id', userId)
    .order('session_date', { ascending: true });

  console.log('Sessions query result:', { data, error });

  if (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }

  // Check if we have data and handle the mentee relationship properly
  const sessions: Session[] = (data || []).map(session => {
    // Handle case where mentee might be null or an error with proper null checking
    const menteeData = session.mentee && 
                      typeof session.mentee === 'object' && 
                      session.mentee !== null &&
                      !('error' in session.mentee) 
      ? session.mentee 
      : undefined;

    return {
      ...session,
      mentee: menteeData
    };
  });

  console.log('Found sessions:', sessions.length);
  return sessions;
};

import { supabase } from '@/integrations/supabase/client';
import { CoachSession } from '@/types/coachSessions';

export const fetchCoachSessions = async (userId: string): Promise<CoachSession[]> => {
  console.log('Fetching coach sessions for user:', userId);
  
  try {
    // Fetch ALL sessions for all coaches to see (as requested)
    const { data, error } = await supabase
      .from('coaching_sessions')
      .select(`
        *,
        mentee:mentee_id(
          email,
          first_name,
          last_name
        )
      `)
      .order('session_date', { ascending: true });

    if (error) {
      console.error('Error fetching coach sessions:', error);
      throw error;
    }

    console.log('Raw sessions data:', data);

    // Transform data to include mentee information
    const transformedSessions = data?.map(session => {
      const menteeData = session.mentee as any;
      console.log('Processing session:', session.id, 'with mentee data:', menteeData);
      
      return {
        ...session,
        mentee: undefined, // Remove nested mentee object
        mentee_name: menteeData ? `${menteeData.first_name} ${menteeData.last_name}` : 'Unknown Mentee',
        mentee_email: menteeData?.email || ''
      };
    }) || [];

    console.log('Transformed sessions:', transformedSessions);
    return transformedSessions;
  } catch (error) {
    console.error('Failed to fetch coach sessions:', error);
    throw error;
  }
};

export const confirmSession = async (sessionId: string, coachId: string) => {
  const { error } = await supabase
    .from('coaching_sessions')
    .update({ 
      status: 'confirmed',
      coach_id: coachId,
      meeting_link: `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error confirming session:', error);
    throw error;
  }

  return {
    status: 'confirmed',
    coach_id: coachId,
    meeting_link: `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`
  };
};

export const cancelSession = async (sessionId: string) => {
  const { error } = await supabase
    .from('coaching_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('Error cancelling session:', error);
    throw error;
  }
};

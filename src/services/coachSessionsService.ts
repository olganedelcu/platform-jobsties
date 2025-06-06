
import { supabase } from '@/integrations/supabase/client';
import { CoachSession } from '@/types/coachSessions';

export const fetchCoachSessions = async (userId: string): Promise<CoachSession[]> => {
  // Get coach's full name from profiles
  const { data: userData } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', userId)
    .single();
    
  if (!userData) {
    return [];
  }
  
  const coachFullName = `${userData.first_name} ${userData.last_name}`;
  
  // Fetch sessions either assigned to this coach's ID or where preferred coach matches name
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
    .or(`coach_id.eq.${userId},preferred_coach.eq.${coachFullName}`)
    .order('session_date', { ascending: true });

  if (error) {
    throw error;
  }

  // Transform data to include mentee information
  return data?.map(session => {
    const menteeData = session.mentee as any;
    return {
      ...session,
      mentee: undefined, // Remove nested mentee object
      mentee_name: menteeData ? `${menteeData.first_name} ${menteeData.last_name}` : 'Unknown',
      mentee_email: menteeData?.email || ''
    };
  }) || [];
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
    throw error;
  }
};


import { supabase } from '@/integrations/supabase/client';
import { Session, NewSessionData } from '@/types/sessions';

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

export const addSession = async (userId: string, sessionData: NewSessionData): Promise<Session> => {
  // Combine date and time into a proper timestamp
  const sessionDateTime = new Date(`${sessionData.date}T${sessionData.time}:00`);
  
  // If a specific coach was selected, try to find their ID
  let coachId = null;
  if (sessionData.preferredCoach) {
    // Extract first and last name from the selected coach
    const nameParts = sessionData.preferredCoach.split(' ');
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Try to find the coach ID using first and last name
      const { data: coachData } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'coach')
        .eq('first_name', firstName)
        .eq('last_name', lastName)
        .single();
        
      if (coachData) {
        coachId = coachData.id;
      }
    }
  }
  
  const { data, error } = await supabase
    .from('coaching_sessions')
    .insert({
      mentee_id: userId,
      session_type: sessionData.sessionType,
      session_date: sessionDateTime.toISOString(),
      duration: parseInt(sessionData.duration),
      notes: sessionData.notes,
      preferred_coach: sessionData.preferredCoach,
      status: 'pending', // Use the correct status value
      coach_id: coachId
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

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

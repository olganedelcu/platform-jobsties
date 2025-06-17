
import { supabase } from '@/integrations/supabase/client';
import { Session, NewSessionData } from '@/types/sessions';

export const fetchSessions = async (userId: string): Promise<Session[]> => {
  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('mentee_id', userId)
    .order('session_date', { ascending: true });

  if (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }

  return data || [];
};

export const addSession = async (userId: string, sessionData: NewSessionData): Promise<Session> => {
  const sessionDateTime = new Date(`${sessionData.date}T${sessionData.time}`);
  
  const { data, error } = await supabase
    .from('coaching_sessions')
    .insert({
      mentee_id: userId,
      session_type: sessionData.sessionType,
      session_date: sessionDateTime.toISOString(),
      duration: parseInt(sessionData.duration),
      notes: sessionData.notes,
      preferred_coach: sessionData.preferredCoach,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding session:', error);
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
    console.error('Error updating session:', error);
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
    console.error('Error deleting session:', error);
    throw error;
  }
};

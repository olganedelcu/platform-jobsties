
import { supabase } from '@/integrations/supabase/client';
import { Session, NewSessionData } from '@/types/sessions';

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
        .select('id, email')
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
      status: 'pending',
      coach_id: coachId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  console.log("Session created successfully");

  return data;
};

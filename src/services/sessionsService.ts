
import { supabase } from '@/integrations/supabase/client';
import { Session, NewSessionData } from '@/types/sessions';
import { CoachGoogleCalendarService } from '@/services/coachGoogleCalendarService';

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

  // Get the user's profile for attendee information
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('id', userId)
    .single();

  // Create Google Calendar event in Ana's calendar
  let googleEventId = null;
  try {
    const isConnected = await CoachGoogleCalendarService.isCoachCalendarConnected();
    if (isConnected) {
      const endDateTime = new Date(sessionDateTime.getTime() + parseInt(sessionData.duration) * 60000);
      
      const attendees = [];
      if (userProfile?.email) {
        attendees.push({
          email: userProfile.email,
          displayName: `${userProfile.first_name} ${userProfile.last_name}`.trim(),
        });
      }

      const calendarEvent = {
        summary: `${sessionData.sessionType} Session with ${userProfile?.first_name || 'Mentee'}`,
        description: sessionData.notes ? `Session Notes: ${sessionData.notes}` : 'Coaching session booked through JobsTies platform.',
        start: {
          dateTime: sessionDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees,
      };

      googleEventId = await CoachGoogleCalendarService.createCalendarEvent(calendarEvent);
    }
  } catch (error) {
    console.error('Failed to create Google Calendar event:', error);
    // Continue without calendar event - don't block session creation
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
      google_event_id: googleEventId,
    })
    .select()
    .single();

  if (error) {
    // If session creation failed but calendar event was created, try to clean up
    if (googleEventId) {
      try {
        await CoachGoogleCalendarService.deleteCalendarEvent(googleEventId);
      } catch (cleanupError) {
        console.error('Failed to clean up calendar event:', cleanupError);
      }
    }
    throw error;
  }

  return data;
};

export const updateSession = async (userId: string, sessionId: string, updates: Partial<Session>): Promise<void> => {
  // Get the current session to check for Google Calendar event
  const { data: currentSession } = await supabase
    .from('coaching_sessions')
    .select('google_event_id, session_date, duration, session_type, notes')
    .eq('id', sessionId)
    .eq('mentee_id', userId)
    .single();

  const { error } = await supabase
    .from('coaching_sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('mentee_id', userId);

  if (error) {
    throw error;
  }

  // Update Google Calendar event if it exists and relevant fields changed
  if (currentSession?.google_event_id && (updates.session_date || updates.duration || updates.session_type || updates.notes)) {
    try {
      const isConnected = await CoachGoogleCalendarService.isCoachCalendarConnected();
      if (isConnected) {
        const calendarUpdates: any = {};

        if (updates.session_type) {
          calendarUpdates.summary = `${updates.session_type} Session`;
        }

        if (updates.notes !== undefined) {
          calendarUpdates.description = updates.notes ? `Session Notes: ${updates.notes}` : 'Coaching session booked through JobsTies platform.';
        }

        if (updates.session_date || updates.duration) {
          const sessionDate = updates.session_date ? new Date(updates.session_date) : new Date(currentSession.session_date);
          const duration = updates.duration || currentSession.duration;
          const endDate = new Date(sessionDate.getTime() + duration * 60000);

          calendarUpdates.start = {
            dateTime: sessionDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };
          calendarUpdates.end = {
            dateTime: endDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };
        }

        await CoachGoogleCalendarService.updateCalendarEvent(currentSession.google_event_id, calendarUpdates);
      }
    } catch (error) {
      console.error('Failed to update Google Calendar event:', error);
      // Don't throw error - session update was successful
    }
  }
};

export const deleteSession = async (userId: string, sessionId: string): Promise<void> => {
  // Get the session to check for Google Calendar event
  const { data: session } = await supabase
    .from('coaching_sessions')
    .select('google_event_id')
    .eq('id', sessionId)
    .eq('mentee_id', userId)
    .single();

  const { error } = await supabase
    .from('coaching_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('mentee_id', userId);

  if (error) {
    throw error;
  }

  // Delete Google Calendar event if it exists
  if (session?.google_event_id) {
    try {
      const isConnected = await CoachGoogleCalendarService.isCoachCalendarConnected();
      if (isConnected) {
        await CoachGoogleCalendarService.deleteCalendarEvent(session.google_event_id);
      }
    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error);
      // Don't throw error - session deletion was successful
    }
  }
};

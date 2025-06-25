import { supabase } from '@/integrations/supabase/client';
import { CoachSession } from '@/types/coachSessions';
import { FormspreeNotificationHandlers } from '@/utils/formspree/formspreeHandlers';

export const fetchCoachSessions = async (userId: string): Promise<CoachSession[]> => {
  console.log('Fetching coach sessions for user:', userId);
  
  try {
    // First fetch sessions that are pending or assigned to this coach
    const { data: sessions, error: sessionsError } = await supabase
      .from('coaching_sessions')
      .select('*')
      .or(`status.eq.pending,coach_id.eq.${userId}`)
      .order('session_date', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching coach sessions:', sessionsError);
      throw sessionsError;
    }

    console.log('Raw sessions data:', sessions);

    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Get unique mentee IDs from sessions (filter out null values)
    const menteeIds = [...new Set(sessions.filter(session => session.mentee_id).map(session => session.mentee_id))];
    
    // Fetch mentee profiles separately (only if we have mentee IDs)
    let profiles: any[] = [];
    if (menteeIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
        .in('id', menteeIds);

      if (profilesError) {
        console.error('Error fetching mentee profiles:', profilesError);
        throw profilesError;
      }

      profiles = profilesData || [];
      console.log('Mentee profiles data:', profiles);
    }

    // Create a map of mentee profiles for easy lookup
    const profileMap = new Map();
    profiles.forEach(profile => {
      profileMap.set(profile.id, profile);
    });

    // Transform sessions to include mentee information
    const transformedSessions = sessions.map(session => {
      if (!session.mentee_id) {
        // Handle sessions without mentee_id (guest sessions)
        console.log('Processing guest session:', session.id);
        
        // Extract guest info from notes if available
        const guestMatch = session.notes?.match(/Guest: ([^(]+)\(([^)]+)\)/);
        const guestName = guestMatch ? guestMatch[1].trim() : 'Guest';
        const guestEmail = guestMatch ? guestMatch[2].trim() : '';
        
        return {
          ...session,
          mentee_name: guestName,
          mentee_email: guestEmail
        };
      }

      const menteeProfile = profileMap.get(session.mentee_id);
      console.log('Processing session:', session.id, 'with mentee profile:', menteeProfile);
      
      return {
        ...session,
        mentee_name: menteeProfile ? `${menteeProfile.first_name} ${menteeProfile.last_name}` : 'Unknown Mentee',
        mentee_email: menteeProfile?.email || ''
      };
    });

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
  // First, get the session details before deleting
  const { data: sessionData, error: fetchError } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchError) {
    console.error('Error fetching session for cancellation:', fetchError);
    throw fetchError;
  }

  // Get the mentee profile separately if session data exists and has a mentee_id
  if (sessionData && sessionData.mentee_id) {
    const { data: menteeProfile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', sessionData.mentee_id)
      .single();

    if (!profileError && menteeProfile) {
      const date = new Date(sessionData.session_date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      try {
        await FormspreeNotificationHandlers.sessionCancellation({
          menteeEmail: menteeProfile.email,
          menteeName: `${menteeProfile.first_name} ${menteeProfile.last_name}`,
          sessionType: sessionData.session_type,
          sessionDate: formattedDate,
          sessionTime: formattedTime,
          duration: sessionData.duration,
          notes: sessionData.notes
        });
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError);
        // Don't throw email error, still proceed with deletion
      }
    }
  }

  // Delete the session
  const { error } = await supabase
    .from('coaching_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('Error cancelling session:', error);
    throw error;
  }
};

// New function to create a session from coach side
export const createCoachSession = async (coachId: string, sessionData: {
  menteeId: string;
  sessionType: string;
  sessionDate: string;
  duration: number;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('coaching_sessions')
    .insert({
      coach_id: coachId,
      mentee_id: sessionData.menteeId,
      session_type: sessionData.sessionType,
      session_date: sessionData.sessionDate,
      duration: sessionData.duration,
      notes: sessionData.notes,
      status: 'confirmed', // Coach-created sessions are automatically confirmed
      meeting_link: `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating coach session:', error);
    throw error;
  }

  return data;
};

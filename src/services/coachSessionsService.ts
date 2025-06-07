
import { supabase } from '@/integrations/supabase/client';
import { CoachSession } from '@/types/coachSessions';
import { EmailNotificationService } from '@/services/emailNotificationService';

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

    // Get unique mentee IDs from sessions
    const menteeIds = [...new Set(sessions.map(session => session.mentee_id))];
    
    // Fetch mentee profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', menteeIds);

    if (profilesError) {
      console.error('Error fetching mentee profiles:', profilesError);
      throw profilesError;
    }

    console.log('Mentee profiles data:', profiles);

    // Create a map of mentee profiles for easy lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });

    // Transform sessions to include mentee information
    const transformedSessions = sessions.map(session => {
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
    .select(`
      *,
      profiles!coaching_sessions_mentee_id_fkey(first_name, last_name, email)
    `)
    .eq('id', sessionId)
    .single();

  if (fetchError) {
    console.error('Error fetching session for cancellation:', fetchError);
    throw fetchError;
  }

  // Send cancellation notification if session data exists
  if (sessionData && sessionData.profiles) {
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
      await EmailNotificationService.sendSessionCancellationNotification({
        menteeEmail: sessionData.profiles.email,
        menteeName: `${sessionData.profiles.first_name} ${sessionData.profiles.last_name}`,
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

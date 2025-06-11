
import { supabase } from '@/integrations/supabase/client';

interface CalendarSettings {
  google_calendar_connected: boolean;
  sync_enabled: boolean;
  last_sync_at?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_available_for_booking: boolean;
  google_event_id: string;
}

export class CoachCalendarService {
  static async getCalendarSettings(coachId: string): Promise<CalendarSettings | null> {
    const { data, error } = await supabase
      .from('coach_calendar_settings')
      .select('*')
      .eq('coach_id', coachId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  static async getCalendarEvents(coachId: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('coach_calendar_events')
      .select('*')
      .eq('coach_id', coachId)
      .order('start_time', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  static async updateEventBookability(eventId: string, isBookable: boolean): Promise<void> {
    const { error } = await supabase
      .from('coach_calendar_events')
      .update({ is_available_for_booking: isBookable })
      .eq('id', eventId);

    if (error) {
      throw error;
    }
  }

  static async getGoogleAuthUrl(): Promise<string> {
    const { data, error } = await supabase.functions.invoke('google-oauth', {
      body: { action: 'get_auth_url' }
    });

    if (error) {
      throw error;
    }

    return data.auth_url;
  }

  static async connectGoogleCalendar(): Promise<void> {
    // Get the OAuth URL
    const authUrl = await this.getGoogleAuthUrl();
    
    // Open popup window for OAuth
    const popup = window.open(
      authUrl,
      'google-oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Wait for popup to close or OAuth to complete
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Give a moment for the tokens to be saved
          setTimeout(resolve, 1000);
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        if (popup && !popup.closed) {
          popup.close();
        }
        reject(new Error('OAuth timeout'));
      }, 300000);
    });
  }

  static async checkGoogleConnection(coachId?: string): Promise<boolean> {
    // Check if Ana's tokens exist
    const { data, error } = await supabase
      .from('coach_google_tokens')
      .select('access_token')
      .eq('coach_email', 'ana@jobsties.com')
      .maybeSingle();

    return !error && !!data;
  }

  static async disconnectGoogleCalendar(coachId: string): Promise<void> {
    // Remove tokens
    await supabase
      .from('coach_google_tokens')
      .delete()
      .eq('coach_email', 'ana@jobsties.com');

    // Update settings
    const { error } = await supabase
      .from('coach_calendar_settings')
      .update({
        google_calendar_connected: false,
        sync_enabled: false,
        last_sync_at: null
      })
      .eq('coach_id', coachId);

    if (error) {
      throw error;
    }

    // Clear calendar events
    await supabase
      .from('coach_calendar_events')
      .delete()
      .eq('coach_id', coachId);
  }

  static async updateSyncSettings(coachId: string, syncEnabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('coach_calendar_settings')
      .update({ sync_enabled: syncEnabled })
      .eq('coach_id', coachId);

    if (error) {
      throw error;
    }
  }

  static async syncWithGoogleCalendar(coachId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { coach_id: coachId }
    });

    if (error) {
      throw error;
    }
  }

  static async checkAvailability(coachId: string, startTime: string, endTime: string): Promise<boolean> {
    // Check if there are any conflicting events
    const { data: conflicts, error } = await supabase
      .from('coach_calendar_events')
      .select('id')
      .eq('coach_id', coachId)
      .eq('is_available_for_booking', false)
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`);

    if (error) {
      throw error;
    }

    // Also check existing coaching sessions
    const { data: sessionConflicts, error: sessionError } = await supabase
      .from('coaching_sessions')
      .select('id')
      .eq('coach_id', coachId)
      .in('status', ['confirmed', 'pending'])
      .or(`and(session_date.lte.${startTime},session_date.gt.${startTime}),and(session_date.lt.${endTime},session_date.gte.${endTime})`);

    if (sessionError) {
      throw sessionError;
    }

    return (conflicts?.length || 0) === 0 && (sessionConflicts?.length || 0) === 0;
  }
}

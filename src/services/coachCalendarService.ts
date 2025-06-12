
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
    if (!coachId || typeof coachId !== 'string') {
      throw new Error('Valid coach ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('coach_calendar_settings')
        .select('google_calendar_connected, sync_enabled, last_sync_at')
        .eq('coach_id', coachId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to retrieve calendar settings');
      }

      return data;
    } catch (error) {
      throw new Error('Calendar settings access failed');
    }
  }

  static async getCalendarEvents(coachId: string): Promise<CalendarEvent[]> {
    if (!coachId || typeof coachId !== 'string') {
      throw new Error('Valid coach ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('coach_calendar_events')
        .select('id, title, description, start_time, end_time, is_available_for_booking, google_event_id')
        .eq('coach_id', coachId)
        .order('start_time', { ascending: true });

      if (error) {
        throw new Error('Failed to retrieve calendar events');
      }

      return data || [];
    } catch (error) {
      throw new Error('Calendar events access failed');
    }
  }

  static async updateEventBookability(eventId: string, isBookable: boolean): Promise<void> {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Valid event ID is required');
    }

    if (typeof isBookable !== 'boolean') {
      throw new Error('Valid bookability status is required');
    }

    try {
      const { error } = await supabase
        .from('coach_calendar_events')
        .update({ is_available_for_booking: isBookable })
        .eq('id', eventId);

      if (error) {
        throw new Error('Failed to update event bookability');
      }
    } catch (error) {
      throw new Error('Event update failed');
    }
  }

  static async getGoogleAuthUrl(): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('google-oauth', {
        body: { action: 'get_auth_url' }
      });

      if (error) {
        throw new Error('OAuth service unavailable');
      }

      if (!data?.auth_url || typeof data.auth_url !== 'string') {
        throw new Error('Invalid OAuth URL received');
      }

      return data.auth_url;
    } catch (error) {
      throw new Error('Failed to generate OAuth URL');
    }
  }

  static async connectGoogleCalendar(): Promise<void> {
    try {
      const authUrl = await this.getGoogleAuthUrl();
      
      const popup = window.open(
        authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked - please allow popups for this site');
      }

      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setTimeout(resolve, 1000);
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(checkClosed);
          if (!popup.closed) {
            popup.close();
          }
          reject(new Error('OAuth timeout - please try again'));
        }, 300000); // 5 minutes
      });
    } catch (error) {
      throw new Error('Google Calendar connection failed');
    }
  }

  static async checkGoogleConnection(coachId?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('coach_google_tokens')
        .select('access_token, expires_at')
        .eq('coach_email', 'ana@jobsties.com')
        .maybeSingle();

      if (error || !data?.access_token) {
        return false;
      }

      // Check if token is still valid
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      
      return expiresAt.getTime() > now.getTime();
    } catch (error) {
      return false;
    }
  }

  static async disconnectGoogleCalendar(coachId: string): Promise<void> {
    if (!coachId || typeof coachId !== 'string') {
      throw new Error('Valid coach ID is required');
    }

    try {
      // Remove tokens securely
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
        throw new Error('Failed to update calendar settings');
      }

      // Clear calendar events
      await supabase
        .from('coach_calendar_events')
        .delete()
        .eq('coach_id', coachId);
    } catch (error) {
      throw new Error('Failed to disconnect Google Calendar');
    }
  }

  static async updateSyncSettings(coachId: string, syncEnabled: boolean): Promise<void> {
    if (!coachId || typeof coachId !== 'string') {
      throw new Error('Valid coach ID is required');
    }

    if (typeof syncEnabled !== 'boolean') {
      throw new Error('Valid sync status is required');
    }

    try {
      const { error } = await supabase
        .from('coach_calendar_settings')
        .update({ sync_enabled: syncEnabled })
        .eq('coach_id', coachId);

      if (error) {
        throw new Error('Failed to update sync settings');
      }
    } catch (error) {
      throw new Error('Sync settings update failed');
    }
  }

  static async syncWithGoogleCalendar(coachId: string): Promise<void> {
    if (!coachId || typeof coachId !== 'string') {
      throw new Error('Valid coach ID is required');
    }

    try {
      const { error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { coach_id: coachId }
      });

      if (error) {
        throw new Error('Calendar sync service unavailable');
      }
    } catch (error) {
      throw new Error('Calendar synchronization failed');
    }
  }

  static async checkAvailability(coachId: string, startTime: string, endTime: string): Promise<boolean> {
    if (!coachId || typeof coachId !== 'string') {
      throw new Error('Valid coach ID is required');
    }

    if (!startTime || !endTime) {
      throw new Error('Valid time range is required');
    }

    try {
      // Validate time format
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid time format');
      }

      if (start >= end) {
        throw new Error('Start time must be before end time');
      }

      // Check conflicting events
      const { data: conflicts, error } = await supabase
        .from('coach_calendar_events')
        .select('id')
        .eq('coach_id', coachId)
        .eq('is_available_for_booking', false)
        .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`);

      if (error) {
        throw new Error('Failed to check calendar conflicts');
      }

      // Check existing sessions
      const { data: sessionConflicts, error: sessionError } = await supabase
        .from('coaching_sessions')
        .select('id')
        .eq('coach_id', coachId)
        .in('status', ['confirmed', 'pending'])
        .or(`and(session_date.lte.${startTime},session_date.gt.${startTime}),and(session_date.lt.${endTime},session_date.gte.${endTime})`);

      if (sessionError) {
        throw new Error('Failed to check session conflicts');
      }

      return (conflicts?.length || 0) === 0 && (sessionConflicts?.length || 0) === 0;
    } catch (error) {
      throw new Error('Availability check failed');
    }
  }
}

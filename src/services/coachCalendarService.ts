import { supabase } from '@/integrations/supabase/client';
import { SecureErrorHandler } from '@/utils/errorHandling';

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
      const error = SecureErrorHandler.handleError(
        new Error('Invalid coach ID'), 
        { component: 'CoachCalendarService', action: 'getCalendarSettings' }
      );
      throw new Error(error.message);
    }

    try {
      const { data, error } = await supabase
        .from('coach_calendar_settings')
        .select('google_calendar_connected, sync_enabled, last_sync_at')
        .eq('coach_id', coachId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'getCalendarSettings' }
        );
        throw new Error(sanitizedError.message);
      }

      return data;
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'getCalendarSettings' }
      );
      throw new Error(sanitizedError.message);
    }
  }

  static async getCalendarEvents(coachId: string): Promise<CalendarEvent[]> {
    if (!coachId || typeof coachId !== 'string') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid coach ID'),
        { component: 'CoachCalendarService', action: 'getCalendarEvents' }
      );
      throw new Error(error.message);
    }

    try {
      const { data, error } = await supabase
        .from('coach_calendar_events')
        .select('id, title, description, start_time, end_time, is_available_for_booking, google_event_id')
        .eq('coach_id', coachId)
        .order('start_time', { ascending: true });

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'getCalendarEvents' }
        );
        throw new Error(sanitizedError.message);
      }

      return data || [];
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'getCalendarEvents' }
      );
      throw new Error(sanitizedError.message);
    }
  }

  static async updateEventBookability(eventId: string, isBookable: boolean): Promise<void> {
    if (!eventId || typeof eventId !== 'string') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid event ID'),
        { component: 'CoachCalendarService', action: 'updateEventBookability' }
      );
      throw new Error(error.message);
    }

    if (typeof isBookable !== 'boolean') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid bookability status'),
        { component: 'CoachCalendarService', action: 'updateEventBookability' }
      );
      throw new Error(error.message);
    }

    try {
      const { error } = await supabase
        .from('coach_calendar_events')
        .update({ is_available_for_booking: isBookable })
        .eq('id', eventId);

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'updateEventBookability' }
        );
        throw new Error(sanitizedError.message);
      }
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'updateEventBookability' }
      );
      throw new Error(sanitizedError.message);
    }
  }

  static async getGoogleAuthUrl(): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('google-oauth', {
        body: { action: 'get_auth_url' }
      });

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'getGoogleAuthUrl' }
        );
        throw new Error(sanitizedError.message);
      }

      if (!data?.auth_url || typeof data.auth_url !== 'string') {
        const error = SecureErrorHandler.handleError(
          new Error('Invalid OAuth URL received'),
          { component: 'CoachCalendarService', action: 'getGoogleAuthUrl' }
        );
        throw new Error(error.message);
      }

      return data.auth_url;
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'getGoogleAuthUrl' }
      );
      throw new Error(sanitizedError.message);
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
        const error = SecureErrorHandler.handleError(
          new Error('Popup blocked'),
          { component: 'CoachCalendarService', action: 'connectGoogleCalendar' }
        );
        throw new Error(error.message);
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
          const error = SecureErrorHandler.handleError(
            new Error('OAuth timeout'),
            { component: 'CoachCalendarService', action: 'connectGoogleCalendar' }
          );
          reject(new Error(error.message));
        }, 300000);
      });
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'connectGoogleCalendar' }
      );
      throw new Error(sanitizedError.message);
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

      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      
      return expiresAt.getTime() > now.getTime();
    } catch (error) {
      return false;
    }
  }

  static async disconnectGoogleCalendar(coachId: string): Promise<void> {
    if (!coachId || typeof coachId !== 'string') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid coach ID'),
        { component: 'CoachCalendarService', action: 'disconnectGoogleCalendar' }
      );
      throw new Error(error.message);
    }

    try {
      await supabase
        .from('coach_google_tokens')
        .delete()
        .eq('coach_email', 'ana@jobsties.com');

      const { error } = await supabase
        .from('coach_calendar_settings')
        .update({
          google_calendar_connected: false,
          sync_enabled: false,
          last_sync_at: null
        })
        .eq('coach_id', coachId);

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'disconnectGoogleCalendar' }
        );
        throw new Error(sanitizedError.message);
      }

      await supabase
        .from('coach_calendar_events')
        .delete()
        .eq('coach_id', coachId);
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'disconnectGoogleCalendar' }
      );
      throw new Error(sanitizedError.message);
    }
  }

  static async updateSyncSettings(coachId: string, syncEnabled: boolean): Promise<void> {
    if (!coachId || typeof coachId !== 'string') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid coach ID'),
        { component: 'CoachCalendarService', action: 'updateSyncSettings' }
      );
      throw new Error(error.message);
    }

    if (typeof syncEnabled !== 'boolean') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid sync status'),
        { component: 'CoachCalendarService', action: 'updateSyncSettings' }
      );
      throw new Error(error.message);
    }

    try {
      const { error } = await supabase
        .from('coach_calendar_settings')
        .update({ sync_enabled: syncEnabled })
        .eq('coach_id', coachId);

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'updateSyncSettings' }
        );
        throw new Error(sanitizedError.message);
      }
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'updateSyncSettings' }
      );
      throw new Error(sanitizedError.message);
    }
  }

  static async syncWithGoogleCalendar(coachId: string): Promise<void> {
    if (!coachId || typeof coachId !== 'string') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid coach ID'),
        { component: 'CoachCalendarService', action: 'syncWithGoogleCalendar' }
      );
      throw new Error(error.message);
    }

    try {
      const { error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { coach_id: coachId }
      });

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'syncWithGoogleCalendar' }
        );
        throw new Error(sanitizedError.message);
      }
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'syncWithGoogleCalendar' }
      );
      throw new Error(sanitizedError.message);
    }
  }

  static async checkAvailability(coachId: string, startTime: string, endTime: string): Promise<boolean> {
    if (!coachId || typeof coachId !== 'string') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid coach ID'),
        { component: 'CoachCalendarService', action: 'checkAvailability' }
      );
      throw new Error(error.message);
    }

    if (!startTime || !endTime) {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid time range'),
        { component: 'CoachCalendarService', action: 'checkAvailability' }
      );
      throw new Error(error.message);
    }

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        const error = SecureErrorHandler.handleError(
          new Error('Invalid time format'),
          { component: 'CoachCalendarService', action: 'checkAvailability' }
        );
        throw new Error(error.message);
      }

      if (start >= end) {
        const error = SecureErrorHandler.handleError(
          new Error('Invalid time range'),
          { component: 'CoachCalendarService', action: 'checkAvailability' }
        );
        throw new Error(error.message);
      }

      const { data: conflicts, error } = await supabase
        .from('coach_calendar_events')
        .select('id')
        .eq('coach_id', coachId)
        .eq('is_available_for_booking', false)
        .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`);

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'checkAvailability' }
        );
        throw new Error(sanitizedError.message);
      }

      const { data: sessionConflicts, error: sessionError } = await supabase
        .from('coaching_sessions')
        .select('id')
        .eq('coach_id', coachId)
        .in('status', ['confirmed', 'pending'])
        .or(`and(session_date.lte.${startTime},session_date.gt.${startTime}),and(session_date.lt.${endTime},session_date.gte.${endTime})`);

      if (sessionError) {
        const sanitizedError = SecureErrorHandler.handleError(
          sessionError,
          { component: 'CoachCalendarService', action: 'checkAvailability' }
        );
        throw new Error(sanitizedError.message);
      }

      return (conflicts?.length || 0) === 0 && (sessionConflicts?.length || 0) === 0;
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'checkAvailability' }
      );
      throw new Error(sanitizedError.message);
    }
  }
}

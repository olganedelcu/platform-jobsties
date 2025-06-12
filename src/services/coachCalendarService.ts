
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

      // Always return disconnected state since Google Calendar is removed
      return {
        google_calendar_connected: false,
        sync_enabled: false,
        last_sync_at: data?.last_sync_at
      };
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

  static async addManualAvailability(coachId: string, eventData: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    is_available_for_booking: boolean;
  }): Promise<void> {
    if (!coachId || typeof coachId !== 'string') {
      const error = SecureErrorHandler.handleError(
        new Error('Invalid coach ID'),
        { component: 'CoachCalendarService', action: 'addManualAvailability' }
      );
      throw new Error(error.message);
    }

    try {
      const { error } = await supabase
        .from('coach_calendar_events')
        .insert({
          coach_id: coachId,
          google_event_id: `manual_${Date.now()}`,
          calendar_id: 'manual',
          ...eventData
        });

      if (error) {
        const sanitizedError = SecureErrorHandler.handleError(
          error,
          { component: 'CoachCalendarService', action: 'addManualAvailability' }
        );
        throw new Error(sanitizedError.message);
      }
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleError(
        error,
        { component: 'CoachCalendarService', action: 'addManualAvailability' }
      );
      throw new Error(sanitizedError.message);
    }
  }
}

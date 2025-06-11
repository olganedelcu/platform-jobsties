
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CoachCalendarService } from '@/services/coachCalendarService';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_available_for_booking: boolean;
  google_event_id: string;
}

interface CalendarSettings {
  google_calendar_connected: boolean;
  sync_enabled: boolean;
  last_sync_at?: string;
}

export const useCoachCalendar = (coachId: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<CalendarSettings>({
    google_calendar_connected: false,
    sync_enabled: false
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      
      // Check if Google Calendar is connected
      const isGoogleConnected = await CoachCalendarService.checkGoogleConnection(coachId);
      
      const [calendarSettings, calendarEvents] = await Promise.all([
        CoachCalendarService.getCalendarSettings(coachId),
        CoachCalendarService.getCalendarEvents(coachId)
      ]);
      
      setSettings({
        ...calendarSettings,
        google_calendar_connected: isGoogleConnected
      } || {
        google_calendar_connected: isGoogleConnected,
        sync_enabled: false
      });
      setEvents(calendarEvents || []);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (startTime: string, endTime: string): Promise<boolean> => {
    try {
      return await CoachCalendarService.checkAvailability(coachId, startTime, endTime);
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const syncCalendar = async () => {
    try {
      await CoachCalendarService.syncWithGoogleCalendar(coachId);
      await loadCalendarData();
      toast({
        title: "Success",
        description: "Calendar synced successfully"
      });
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast({
        title: "Error",
        description: "Failed to sync calendar",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (coachId) {
      loadCalendarData();
    }
  }, [coachId]);

  return {
    events,
    settings,
    loading,
    loadCalendarData,
    checkAvailability,
    syncCalendar
  };
};

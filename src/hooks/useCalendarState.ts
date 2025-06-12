
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

interface CalendarSettingsType {
  google_calendar_connected: boolean;
  sync_enabled: boolean;
  last_sync_at?: string;
}

export const useCalendarState = (coachId: string) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<CalendarSettingsType>({
    google_calendar_connected: false,
    sync_enabled: false
  });
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCalendarData();
  }, [coachId]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const [calendarSettings, calendarEvents] = await Promise.all([
        CoachCalendarService.getCalendarSettings(coachId),
        CoachCalendarService.getCalendarEvents(coachId)
      ]);
      
      setSettings(calendarSettings || {
        google_calendar_connected: false,
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

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.start_time).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  return {
    selectedDate,
    setSelectedDate,
    events,
    settings,
    loading,
    showSettings,
    setShowSettings,
    showManualForm,
    setShowManualForm,
    loadCalendarData,
    getEventsForDate
  };
};

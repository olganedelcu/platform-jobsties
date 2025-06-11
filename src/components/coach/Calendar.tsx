
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { CoachCalendarService } from '@/services/coachCalendarService';
import CalendarSettings from './CalendarSettings';
import CalendarEventsList from './CalendarEventsList';

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

interface CoachCalendarProps {
  coachId: string;
}

const CoachCalendar = ({ coachId }: CoachCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<CalendarSettings>({
    google_calendar_connected: false,
    sync_enabled: false
  });
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  const handleSyncCalendar = async () => {
    try {
      setLoading(true);
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

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar & Availability</h2>
          <p className="text-gray-600">Manage your schedule and availability for mentee sessions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {settings.google_calendar_connected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncCalendar}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="font-medium">Google Calendar Integration</p>
                <p className="text-sm text-gray-600">
                  {settings.google_calendar_connected ? 
                    `Last synced: ${settings.last_sync_at ? new Date(settings.last_sync_at).toLocaleString() : 'Never'}` :
                    'Connect your Google Calendar to manage availability'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={settings.google_calendar_connected ? "default" : "secondary"}>
                {settings.google_calendar_connected ? "Connected" : "Not Connected"}
              </Badge>
              {settings.google_calendar_connected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://calendar.google.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Calendar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showSettings && (
        <CalendarSettings
          settings={settings}
          onSettingsUpdate={() => loadCalendarData()}
          coachId={coachId}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => getEventsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasEvents: { 
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>
              Events for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarEventsList
              events={selectedDateEvents}
              onEventUpdate={() => loadCalendarData()}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachCalendar;

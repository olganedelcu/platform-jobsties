
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface CalendarEventsViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onEventUpdate: () => void;
  loading: boolean;
}

const CalendarEventsView = ({ selectedDate, events, onEventUpdate, loading }: CalendarEventsViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Events for {selectedDate.toLocaleDateString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarEventsList
          events={events}
          onEventUpdate={onEventUpdate}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarEventsView;

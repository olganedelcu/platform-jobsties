
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_available_for_booking: boolean;
  google_event_id: string;
}

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
}

const CalendarView = ({ selectedDate, onSelectDate, getEventsForDate }: CalendarViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
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
  );
};

export default CalendarView;

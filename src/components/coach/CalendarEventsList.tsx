
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock, Calendar, Users } from 'lucide-react';
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

interface CalendarEventsListProps {
  events: CalendarEvent[];
  onEventUpdate: () => void;
  loading: boolean;
}

const CalendarEventsList = ({ events, onEventUpdate, loading }: CalendarEventsListProps) => {
  const [updatingEvents, setUpdatingEvents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleToggleBookability = async (eventId: string, currentStatus: boolean) => {
    setUpdatingEvents(prev => new Set(prev).add(eventId));
    
    try {
      await CoachCalendarService.updateEventBookability(eventId, !currentStatus);
      onEventUpdate();
      toast({
        title: "Success",
        description: `Event ${!currentStatus ? 'opened' : 'closed'} for booking`
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive"
      });
    } finally {
      setUpdatingEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes}m`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No events scheduled for this date</p>
        <p className="text-sm">Events from your Google Calendar will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{event.title}</h4>
              {event.description && (
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              )}
            </div>
            <Badge variant={event.is_available_for_booking ? "default" : "secondary"}>
              {event.is_available_for_booking ? "Bookable" : "Blocked"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{getDuration(event.start_time, event.end_time)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                checked={event.is_available_for_booking}
                onCheckedChange={() => handleToggleBookability(event.id, event.is_available_for_booking)}
                disabled={updatingEvents.has(event.id)}
              />
              <Label className="text-sm">
                {event.is_available_for_booking ? 'Available for booking' : 'Blocked for booking'}
              </Label>
            </div>
            {updatingEvents.has(event.id) && (
              <div className="text-sm text-gray-500">Updating...</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarEventsList;

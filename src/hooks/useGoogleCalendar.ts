
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarService, GoogleCalendarEvent } from '@/services/googleCalendarService';

export const useGoogleCalendar = (userId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      checkConnection();
    }
  }, [userId]);

  const checkConnection = async () => {
    if (!userId) return;
    
    try {
      const connected = await GoogleCalendarService.isConnected(userId);
      setIsConnected(connected);
    } catch (error) {
      console.error('Error checking Google Calendar connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (event: GoogleCalendarEvent): Promise<string | null> => {
    if (!userId || !isConnected) {
      toast({
        title: "Google Calendar Not Connected",
        description: "Please connect your Google Calendar to create events.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const eventId = await GoogleCalendarService.createCalendarEvent(userId, event);
      toast({
        title: "Calendar Event Created",
        description: "Your session has been added to Google Calendar.",
      });
      return eventId;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      toast({
        title: "Failed to Create Calendar Event",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateEvent = async (eventId: string, event: Partial<GoogleCalendarEvent>): Promise<boolean> => {
    if (!userId || !isConnected) return false;

    try {
      await GoogleCalendarService.updateCalendarEvent(userId, eventId, event);
      toast({
        title: "Calendar Event Updated",
        description: "Your session has been updated in Google Calendar.",
      });
      return true;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      toast({
        title: "Failed to Update Calendar Event",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!userId || !isConnected) return false;

    try {
      await GoogleCalendarService.deleteCalendarEvent(userId, eventId);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  };

  return {
    isConnected,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshConnection: checkConnection,
  };
};

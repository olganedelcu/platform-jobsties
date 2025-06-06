
import { GoogleTokenManager } from './googleTokenManager';

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export class GoogleCalendarApi {
  static async createCalendarEvent(
    userId: string,
    event: GoogleCalendarEvent,
    calendarId: string = 'primary'
  ): Promise<string> {
    const accessToken = await GoogleTokenManager.getValidAccessToken(userId);
    if (!accessToken) {
      throw new Error('No valid access token available. Please re-authenticate.');
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create calendar event: ${error}`);
    }

    const createdEvent = await response.json();
    return createdEvent.id;
  }

  static async updateCalendarEvent(
    userId: string,
    eventId: string,
    event: Partial<GoogleCalendarEvent>,
    calendarId: string = 'primary'
  ): Promise<void> {
    const accessToken = await GoogleTokenManager.getValidAccessToken(userId);
    if (!accessToken) {
      throw new Error('No valid access token available. Please re-authenticate.');
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update calendar event: ${error}`);
    }
  }

  static async deleteCalendarEvent(
    userId: string,
    eventId: string,
    calendarId: string = 'primary'
  ): Promise<void> {
    const accessToken = await GoogleTokenManager.getValidAccessToken(userId);
    if (!accessToken) {
      throw new Error('No valid access token available. Please re-authenticate.');
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete calendar event: ${error}`);
    }
  }
}

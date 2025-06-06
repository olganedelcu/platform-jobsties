
import { supabase } from '@/integrations/supabase/client';

interface CoachGoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

export class CoachGoogleCalendarService {
  private static readonly COACH_EMAIL = 'ana@jobsties.com';

  static async getCoachTokens(): Promise<CoachGoogleTokens | null> {
    const { data, error } = await supabase
      .from('coach_google_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('coach_email', this.COACH_EMAIL)
      .single();

    if (error || !data) {
      console.error('No coach tokens found:', error);
      return null;
    }

    return data;
  }

  static async refreshCoachAccessToken(refreshToken: string): Promise<CoachGoogleTokens> {
    const response = await fetch('/api/google-token-refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to refresh coach access token: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

    const newTokens: CoachGoogleTokens = {
      access_token: data.access_token,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    };

    // Update the coach tokens in the database
    await this.updateCoachTokens(newTokens);
    return newTokens;
  }

  static async updateCoachTokens(tokens: CoachGoogleTokens): Promise<void> {
    const { error } = await supabase
      .from('coach_google_tokens')
      .upsert({
        coach_email: this.COACH_EMAIL,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_at,
      });

    if (error) {
      throw new Error(`Failed to update coach tokens: ${error.message}`);
    }
  }

  static async getValidCoachAccessToken(): Promise<string | null> {
    const tokens = await this.getCoachTokens();
    if (!tokens) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(tokens.expires_at);

    // If token is still valid (with 5 min buffer)
    if (expiresAt.getTime() - now.getTime() > 5 * 60 * 1000) {
      return tokens.access_token;
    }

    // Try to refresh the token
    if (tokens.refresh_token) {
      try {
        const refreshedTokens = await this.refreshCoachAccessToken(tokens.refresh_token);
        return refreshedTokens.access_token;
      } catch (error) {
        console.error('Failed to refresh coach token:', error);
        return null;
      }
    }

    return null;
  }

  static async createCalendarEvent(event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees?: Array<{ email: string; displayName?: string }>;
  }): Promise<string> {
    const accessToken = await this.getValidCoachAccessToken();
    if (!accessToken) {
      throw new Error('No valid coach access token available. Please set up Ana\'s Google Calendar integration.');
    }

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
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
    eventId: string,
    event: {
      summary?: string;
      description?: string;
      start?: { dateTime: string; timeZone: string };
      end?: { dateTime: string; timeZone: string };
      attendees?: Array<{ email: string; displayName?: string }>;
    }
  ): Promise<void> {
    const accessToken = await this.getValidCoachAccessToken();
    if (!accessToken) {
      throw new Error('No valid coach access token available.');
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
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

  static async deleteCalendarEvent(eventId: string): Promise<void> {
    const accessToken = await this.getValidCoachAccessToken();
    if (!accessToken) {
      throw new Error('No valid coach access token available.');
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
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

  static async isCoachCalendarConnected(): Promise<boolean> {
    const tokens = await this.getCoachTokens();
    return tokens !== null;
  }
}

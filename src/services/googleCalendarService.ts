
import { supabase } from '@/integrations/supabase/client';

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

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

// We'll get this from the environment/config - you need to set this in your deployment
const getGoogleClientId = () => {
  // In production, this should come from environment variables
  // For now, we'll need to set this in the Supabase edge function or as a runtime config
  return window.location.hostname.includes('localhost') 
    ? 'your-local-google-client-id' 
    : 'your-production-google-client-id';
};

const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/calendar';

export class GoogleCalendarService {
  private static async getStoredTokens(userId: string): Promise<GoogleTokens | null> {
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  private static async storeTokens(userId: string, tokens: GoogleTokens): Promise<void> {
    const { error } = await supabase
      .from('user_google_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_at,
      });

    if (error) {
      throw new Error(`Failed to store tokens: ${error.message}`);
    }
  }

  private static async refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

    return {
      access_token: data.access_token,
      refresh_token: refreshToken, // Keep the existing refresh token
      expires_at: expiresAt,
    };
  }

  private static async getValidAccessToken(userId: string): Promise<string | null> {
    const tokens = await this.getStoredTokens(userId);
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
        const refreshedTokens = await this.refreshAccessToken(tokens.refresh_token);
        await this.storeTokens(userId, refreshedTokens);
        return refreshedTokens.access_token;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return null;
  }

  static getAuthUrl(): string {
    const clientId = getGoogleClientId();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${window.location.origin}/google-auth-callback`,
      scope: GOOGLE_SCOPE,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async handleAuthCallback(code: string, userId: string): Promise<void> {
    const clientId = getGoogleClientId();
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${window.location.origin}/google-auth-callback`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange auth code for tokens');
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

    const tokens: GoogleTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt,
    };

    await this.storeTokens(userId, tokens);
  }

  static async createCalendarEvent(
    userId: string,
    event: GoogleCalendarEvent,
    calendarId: string = 'primary'
  ): Promise<string> {
    const accessToken = await this.getValidAccessToken(userId);
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
    const accessToken = await this.getValidAccessToken(userId);
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
    const accessToken = await this.getValidAccessToken(userId);
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

  static async isConnected(userId: string): Promise<boolean> {
    const tokens = await this.getStoredTokens(userId);
    return tokens !== null;
  }
}

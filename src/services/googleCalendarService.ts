import { getGoogleClientId, getRedirectUri, GOOGLE_SCOPE } from './googleCalendarConfig';
import { GoogleTokenManager, GoogleTokens } from './googleTokenManager';
import { GoogleCalendarApi, GoogleCalendarEvent } from './googleCalendarApi';

export type { GoogleCalendarEvent } from './googleCalendarApi';
export type { GoogleTokens } from './googleTokenManager';

export class GoogleCalendarService {
  static async getAuthUrl(): Promise<string> {
    const clientId = await getGoogleClientId();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: getRedirectUri(),
      scope: GOOGLE_SCOPE,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async handleAuthCallback(code: string, userId: string): Promise<void> {
    const response = await fetch('/api/google-oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirectUri: getRedirectUri(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to exchange auth code for tokens: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

    const tokens: GoogleTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt,
    };

    await GoogleTokenManager.storeTokens(userId, tokens);
  }

  static async createCalendarEvent(
    userId: string,
    event: GoogleCalendarEvent,
    calendarId: string = 'primary'
  ): Promise<string> {
    return GoogleCalendarApi.createCalendarEvent(userId, event, calendarId);
  }

  static async updateCalendarEvent(
    userId: string,
    eventId: string,
    event: Partial<GoogleCalendarEvent>,
    calendarId: string = 'primary'
  ): Promise<void> {
    return GoogleCalendarApi.updateCalendarEvent(userId, eventId, event, calendarId);
  }

  static async deleteCalendarEvent(
    userId: string,
    eventId: string,
    calendarId: string = 'primary'
  ): Promise<void> {
    return GoogleCalendarApi.deleteCalendarEvent(userId, eventId, calendarId);
  }

  static async isConnected(userId: string): Promise<boolean> {
    return GoogleTokenManager.isConnected(userId);
  }
}

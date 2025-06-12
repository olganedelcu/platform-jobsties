
import { supabase } from '@/integrations/supabase/client';

interface CoachGoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

interface TokenValidationResult {
  isValid: boolean;
  needsRefresh: boolean;
  error?: string;
}

export class CoachGoogleCalendarService {
  private static readonly COACH_EMAIL = 'ana@jobsties.com';
  private static readonly TOKEN_BUFFER_MINUTES = 5;

  static async getCoachTokens(): Promise<CoachGoogleTokens | null> {
    try {
      const { data, error } = await supabase
        .from('coach_google_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('coach_email', this.COACH_EMAIL)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  private static validateTokenStructure(tokens: CoachGoogleTokens): TokenValidationResult {
    if (!tokens.access_token || typeof tokens.access_token !== 'string') {
      return { isValid: false, needsRefresh: false, error: 'Invalid access token format' };
    }

    if (!tokens.expires_at || typeof tokens.expires_at !== 'string') {
      return { isValid: false, needsRefresh: false, error: 'Invalid expiration format' };
    }

    const now = new Date();
    const expiresAt = new Date(tokens.expires_at);
    
    if (isNaN(expiresAt.getTime())) {
      return { isValid: false, needsRefresh: false, error: 'Invalid expiration date' };
    }

    const bufferTime = this.TOKEN_BUFFER_MINUTES * 60 * 1000;
    const needsRefresh = expiresAt.getTime() - now.getTime() <= bufferTime;

    return { isValid: true, needsRefresh };
  }

  static async refreshCoachAccessToken(refreshToken: string): Promise<CoachGoogleTokens> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new Error('Invalid refresh token provided');
    }

    try {
      const { data, error } = await supabase.functions.invoke('google-token-refresh', {
        body: { refreshToken },
      });

      if (error) {
        throw new Error('Token refresh service unavailable');
      }

      if (!data || !data.access_token) {
        throw new Error('Invalid token refresh response');
      }

      const expiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString();

      const newTokens: CoachGoogleTokens = {
        access_token: data.access_token,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      };

      await this.updateCoachTokens(newTokens);
      return newTokens;
    } catch (error) {
      throw new Error('Failed to refresh access token');
    }
  }

  static async updateCoachTokens(tokens: CoachGoogleTokens): Promise<void> {
    const validation = this.validateTokenStructure(tokens);
    if (!validation.isValid) {
      throw new Error(`Invalid token data: ${validation.error}`);
    }

    try {
      const { error } = await supabase
        .from('coach_google_tokens')
        .upsert({
          coach_email: this.COACH_EMAIL,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expires_at,
        });

      if (error) {
        throw new Error('Database update failed');
      }
    } catch (error) {
      throw new Error('Failed to store tokens securely');
    }
  }

  static async getValidCoachAccessToken(): Promise<string | null> {
    try {
      const tokens = await this.getCoachTokens();
      if (!tokens) {
        return null;
      }

      const validation = this.validateTokenStructure(tokens);
      if (!validation.isValid) {
        return null;
      }

      if (!validation.needsRefresh) {
        return tokens.access_token;
      }

      if (tokens.refresh_token) {
        try {
          const refreshedTokens = await this.refreshCoachAccessToken(tokens.refresh_token);
          return refreshedTokens.access_token;
        } catch (error) {
          return null;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  static async createCalendarEvent(event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees?: Array<{ email: string; displayName?: string }>;
  }): Promise<string> {
    // Validate event data
    if (!event.summary || typeof event.summary !== 'string') {
      throw new Error('Event summary is required');
    }

    if (!event.start?.dateTime || !event.end?.dateTime) {
      throw new Error('Event start and end times are required');
    }

    const accessToken = await this.getValidCoachAccessToken();
    if (!accessToken) {
      throw new Error('Calendar access unavailable');
    }

    try {
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
        throw new Error('Calendar event creation failed');
      }

      const createdEvent = await response.json();
      if (!createdEvent.id) {
        throw new Error('Invalid event creation response');
      }

      return createdEvent.id;
    } catch (error) {
      throw new Error('Failed to create calendar event');
    }
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
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Valid event ID is required');
    }

    const accessToken = await this.getValidCoachAccessToken();
    if (!accessToken) {
      throw new Error('Calendar access unavailable');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
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
        throw new Error('Calendar event update failed');
      }
    } catch (error) {
      throw new Error('Failed to update calendar event');
    }
  }

  static async deleteCalendarEvent(eventId: string): Promise<void> {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Valid event ID is required');
    }

    const accessToken = await this.getValidCoachAccessToken();
    if (!accessToken) {
      throw new Error('Calendar access unavailable');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Calendar event deletion failed');
      }
    } catch (error) {
      throw new Error('Failed to delete calendar event');
    }
  }

  static async isCoachCalendarConnected(): Promise<boolean> {
    try {
      const tokens = await this.getCoachTokens();
      if (!tokens) {
        return false;
      }

      const validation = this.validateTokenStructure(tokens);
      return validation.isValid;
    } catch (error) {
      return false;
    }
  }

  static async revokeCoachTokens(): Promise<void> {
    try {
      const tokens = await this.getCoachTokens();
      if (tokens?.access_token) {
        // Revoke token with Google
        await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(tokens.access_token)}`, {
          method: 'POST',
        });
      }
    } catch (error) {
      // Continue with local cleanup even if Google revocation fails
    }

    // Always clean up local tokens
    try {
      await supabase
        .from('coach_google_tokens')
        .delete()
        .eq('coach_email', this.COACH_EMAIL);
    } catch (error) {
      throw new Error('Failed to revoke tokens');
    }
  }
}

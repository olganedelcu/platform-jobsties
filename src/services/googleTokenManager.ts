
import { supabase } from '@/integrations/supabase/client';
import { getGoogleClientId } from './googleCalendarConfig';

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

export class GoogleTokenManager {
  static async getStoredTokens(userId: string): Promise<GoogleTokens | null> {
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

  static async storeTokens(userId: string, tokens: GoogleTokens): Promise<void> {
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

  static async refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
    const clientId = getGoogleClientId();
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
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

  static async getValidAccessToken(userId: string): Promise<string | null> {
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

  static async isConnected(userId: string): Promise<boolean> {
    const tokens = await this.getStoredTokens(userId);
    return tokens !== null;
  }
}

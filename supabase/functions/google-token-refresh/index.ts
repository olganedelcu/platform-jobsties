
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenRefreshRequest {
  refreshToken: string;
}

interface TokenRefreshResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
}

function validateRefreshToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Basic format validation for Google refresh tokens
  if (token.length < 50 || token.length > 200) {
    return false;
  }
  
  // Check for basic structure (should contain alphanumeric and some special chars)
  const validPattern = /^[A-Za-z0-9\/\+\-_\.]+$/;
  return validPattern.test(token);
}

function sanitizeErrorMessage(error: string): string {
  // Remove sensitive information from error messages
  const sensitivePatterns = [
    /client_id=[^&\s]*/gi,
    /client_secret=[^&\s]*/gi,
    /refresh_token=[^&\s]*/gi,
    /access_token=[^&\s]*/gi,
  ];
  
  let sanitized = error;
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });
  
  return sanitized;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let requestBody: TokenRefreshRequest;
    
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    const { refreshToken } = requestBody;

    if (!validateRefreshToken(refreshToken)) {
      return new Response(
        JSON.stringify({ error: 'Invalid refresh token format' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }
    
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (!googleClientId || !googleClientSecret) {
      return new Response(
        JSON.stringify({ error: 'OAuth service configuration error' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      const sanitizedError = sanitizeErrorMessage(errorText);
      
      return new Response(
        JSON.stringify({ error: 'Token refresh failed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: tokenResponse.status,
        },
      );
    }

    const tokenData: TokenRefreshResponse = await tokenResponse.json();
    
    // Validate response structure
    if (!tokenData.access_token || typeof tokenData.access_token !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid token response' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    // Validate token format
    if (tokenData.access_token.length < 100 || tokenData.access_token.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Invalid token format received' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    // Set default expiration if not provided
    if (!tokenData.expires_in || typeof tokenData.expires_in !== 'number') {
      tokenData.expires_in = 3600; // 1 hour default
    }

    // Ensure reasonable expiration bounds
    if (tokenData.expires_in < 300 || tokenData.expires_in > 86400) {
      tokenData.expires_in = 3600; // Reset to 1 hour if outside reasonable bounds
    }
    
    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type || 'Bearer'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

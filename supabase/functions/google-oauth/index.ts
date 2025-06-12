
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { action, code, state } = await req.json()
    
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    
    if (!googleClientId || !googleClientSecret) {
      return new Response(
        JSON.stringify({ 
          error: 'Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Supabase secrets.',
          setup_required: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    if (action === 'get_auth_url') {
      // Generate OAuth URL
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth`
      const scope = 'https://www.googleapis.com/auth/calendar'
      const state = 'coach_calendar_auth'
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${state}`
      
      return new Response(
        JSON.stringify({ auth_url: authUrl }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    if (action === 'handle_callback') {
      // Handle OAuth callback
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth`
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: googleClientId,
          client_secret: googleClientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new Error(`OAuth token exchange failed: ${errorText}`)
      }

      const tokenData = await tokenResponse.json()
      
      // Store tokens for Ana's account
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      
      const { error: upsertError } = await supabaseClient
        .from('coach_google_tokens')
        .upsert({
          coach_email: 'ana@jobsties.com',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt,
        })

      if (upsertError) {
        throw new Error(`Failed to store tokens: ${upsertError.message}`)
      }

      // Return success page HTML
      const successHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Google Calendar Connected</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
            .container { max-width: 400px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .success { color: #10b981; font-size: 48px; margin-bottom: 20px; }
            h1 { color: #1f2937; margin-bottom: 16px; }
            p { color: #6b7280; margin-bottom: 30px; }
            button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅</div>
            <h1>Google Calendar Connected!</h1>
            <p>Your Google Calendar has been successfully connected. You can now close this window and return to the platform.</p>
            <button onclick="window.close()">Close Window</button>
          </div>
          <script>
            // Auto-close after 5 seconds
            setTimeout(() => {
              window.close();
            }, 5000);
          </script>
        </body>
        </html>
      `
      
      return new Response(successHtml, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 200,
      })
    }

    // Handle direct OAuth callback from Google (when user is redirected back)
    const url = new URL(req.url)
    const urlCode = url.searchParams.get('code')
    const urlState = url.searchParams.get('state')
    
    if (urlCode && urlState === 'coach_calendar_auth') {
      // This is a redirect from Google OAuth
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth`
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: googleClientId,
          client_secret: googleClientSecret,
          code: urlCode,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new Error(`OAuth token exchange failed: ${errorText}`)
      }

      const tokenData = await tokenResponse.json()
      
      // Store tokens for Ana's account
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      
      const { error: upsertError } = await supabaseClient
        .from('coach_google_tokens')
        .upsert({
          coach_email: 'ana@jobsties.com',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt,
        })

      if (upsertError) {
        throw new Error(`Failed to store tokens: ${upsertError.message}`)
      }

      // Return success page
      const successHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Google Calendar Connected</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
            .container { max-width: 400px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .success { color: #10b981; font-size: 48px; margin-bottom: 20px; }
            h1 { color: #1f2937; margin-bottom: 16px; }
            p { color: #6b7280; margin-bottom: 30px; }
            button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅</div>
            <h1>Google Calendar Connected!</h1>
            <p>Your Google Calendar has been successfully connected. You can now close this window and return to the platform.</p>
            <button onclick="window.close()">Close Window</button>
          </div>
          <script>
            // Auto-close after 5 seconds
            setTimeout(() => {
              window.close();
            }, 5000);
          </script>
        </body>
        </html>
      `
      
      return new Response(successHtml, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 200,
      })
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  } catch (error) {
    console.error('Google OAuth error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

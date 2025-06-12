
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { coach_id } = await req.json()

    if (!coach_id) {
      return new Response(
        JSON.stringify({ error: 'Coach ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get coach's Google Calendar tokens
    const { data: tokens, error: tokenError } = await supabaseClient
      .from('coach_google_tokens')
      .select('access_token')
      .eq('coach_email', 'ana@jobsties.com')
      .single()

    if (tokenError || !tokens) {
      return new Response(
        JSON.stringify({ error: 'Google Calendar not connected' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch events from Google Calendar
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${nextWeek.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      }
    )

    if (!calendarResponse.ok) {
      console.error('Google Calendar API error:', await calendarResponse.text())
      return new Response(
        JSON.stringify({ error: 'Failed to fetch calendar events' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const calendarData = await calendarResponse.json()
    console.log('Fetched calendar events:', calendarData.items?.length || 0)

    // Clear existing events for this coach
    await supabaseClient
      .from('coach_calendar_events')
      .delete()
      .eq('coach_id', coach_id)

    // Insert new events
    if (calendarData.items && calendarData.items.length > 0) {
      const eventsToInsert = calendarData.items
        .filter((event: any) => event.start?.dateTime && event.end?.dateTime)
        .map((event: any) => ({
          coach_id,
          google_event_id: event.id,
          calendar_id: 'primary',
          title: event.summary || 'Untitled Event',
          description: event.description || null,
          start_time: event.start.dateTime,
          end_time: event.end.dateTime,
          is_available_for_booking: false // Default to blocked
        }))

      if (eventsToInsert.length > 0) {
        const { error: insertError } = await supabaseClient
          .from('coach_calendar_events')
          .insert(eventsToInsert)

        if (insertError) {
          console.error('Error inserting events:', insertError)
          return new Response(
            JSON.stringify({ error: 'Failed to save calendar events' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      }
    }

    // Update sync timestamp
    await supabaseClient
      .from('coach_calendar_settings')
      .upsert({
        coach_id,
        google_calendar_connected: true,
        last_sync_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        events_synced: calendarData.items?.length || 0 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Calendar sync error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

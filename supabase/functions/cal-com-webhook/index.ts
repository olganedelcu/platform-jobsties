
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    console.log('Raw webhook body:', body)
    
    // Parse the webhook payload
    let webhookData: any
    try {
      webhookData = JSON.parse(body)
    } catch (parseError) {
      console.error('Failed to parse webhook body:', parseError)
      return new Response('Invalid JSON payload', { 
        status: 400, 
        headers: corsHeaders 
      })
    }
    
    console.log('Parsed webhook data:', JSON.stringify(webhookData, null, 2))

    // Validate basic webhook structure
    if (!webhookData || typeof webhookData !== 'object') {
      console.error('Invalid webhook data structure')
      return new Response('Invalid webhook data structure', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Log the webhook event with the actual structure we received
    const eventType = webhookData.triggerEvent || webhookData.type || 'unknown'
    const bookingData = webhookData.payload?.booking || webhookData.booking || webhookData
    
    console.log('Event type:', eventType)
    console.log('Booking data:', JSON.stringify(bookingData, null, 2))

    // Store the raw webhook for debugging
    await supabase
      .from('cal_com_webhooks')
      .insert({
        event_type: eventType,
        booking_id: bookingData?.uid || bookingData?.id || 'unknown',
        event_data: webhookData,
        processed: false
      })

    // Check if we have booking data in the expected format
    if (!bookingData) {
      console.log('No booking data found in webhook, but logged for analysis')
      return new Response('Webhook logged successfully (no booking data)', {
        status: 200,
        headers: corsHeaders
      })
    }

    // Process the webhook based on event type
    let sessionUpdate: any = {}
    let newStatus = 'pending'

    switch (eventType) {
      case 'BOOKING_CREATED':
      case 'booking.created':
        newStatus = 'confirmed'
        sessionUpdate = {
          status: newStatus,
          cal_com_booking_id: bookingData.uid || bookingData.id,
          meeting_link: bookingData.location || `https://cal.com/meeting/${bookingData.uid || bookingData.id}`
        }
        break

      case 'BOOKING_CANCELLED':
      case 'booking.cancelled':
        newStatus = 'cancelled'
        sessionUpdate = {
          status: newStatus
        }
        break

      case 'BOOKING_RESCHEDULED':
      case 'booking.rescheduled':
        newStatus = 'confirmed'
        sessionUpdate = {
          status: newStatus,
          session_date: bookingData.startTime,
          cal_com_booking_id: bookingData.uid || bookingData.id,
          meeting_link: bookingData.location || `https://cal.com/meeting/${bookingData.uid || bookingData.id}`
        }
        break

      default:
        console.log(`Unhandled event type: ${eventType}`)
        return new Response('Event type not handled but logged', { 
          status: 200, 
          headers: corsHeaders 
        })
    }

    // Only proceed with session updates if we have valid booking data
    if (!bookingData.startTime && !bookingData.start) {
      console.log('No valid booking time found, skipping session update')
      return new Response('Webhook logged successfully (no valid booking time)', {
        status: 200,
        headers: corsHeaders
      })
    }

    // Find the coaching session by matching the booking time and attendee email
    const sessionDate = new Date(bookingData.startTime || bookingData.start)
    const attendeeEmails = (bookingData.attendees || []).map((a: any) => a.email).filter(Boolean)
    
    console.log('Looking for session with:', {
      sessionDate: sessionDate.toISOString(),
      attendeeEmails
    })

    if (attendeeEmails.length === 0) {
      console.log('No attendee emails found, skipping session matching')
      return new Response('Webhook logged successfully (no attendee emails)', {
        status: 200,
        headers: corsHeaders
      })
    }

    // Try to find the session by date and attendee email
    const { data: sessions, error: findError } = await supabase
      .from('coaching_sessions')
      .select(`
        *,
        profiles!coaching_sessions_mentee_id_fkey(email)
      `)
      .gte('session_date', new Date(sessionDate.getTime() - 30 * 60 * 1000).toISOString()) // 30 min before
      .lte('session_date', new Date(sessionDate.getTime() + 30 * 60 * 1000).toISOString()) // 30 min after

    if (findError) {
      console.error('Error finding sessions:', findError)
      return new Response('Database error', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    // Filter sessions by attendee email
    const matchingSessions = sessions?.filter(session => 
      attendeeEmails.includes(session.profiles?.email)
    ) || []

    console.log('Found matching sessions:', matchingSessions.length)

    if (matchingSessions.length === 0) {
      console.log('No matching sessions found')
      return new Response('No matching session found', { 
        status: 200, 
        headers: corsHeaders 
      })
    }

    // Update the first matching session
    const sessionToUpdate = matchingSessions[0]
    
    const { error: updateError } = await supabase
      .from('coaching_sessions')
      .update(sessionUpdate)
      .eq('id', sessionToUpdate.id)

    if (updateError) {
      console.error('Error updating session:', updateError)
      return new Response('Failed to update session', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    // Mark webhook as processed
    await supabase
      .from('cal_com_webhooks')
      .update({ processed: true })
      .eq('booking_id', bookingData.uid || bookingData.id)

    console.log('Successfully processed Cal.com webhook:', {
      bookingId: bookingData.uid || bookingData.id,
      sessionId: sessionToUpdate.id,
      newStatus,
      meetingLink: sessionUpdate.meeting_link
    })

    return new Response('Webhook processed successfully', {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error processing Cal.com webhook:', error)
    return new Response('Internal server error', {
      status: 500,
      headers: corsHeaders
    })
  }
})

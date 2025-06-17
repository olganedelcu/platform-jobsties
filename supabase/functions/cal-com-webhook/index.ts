
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalComWebhookPayload {
  triggerEvent: string;
  createdAt: string;
  payload: {
    booking: {
      id: number;
      uid: string;
      title: string;
      description?: string;
      startTime: string;
      endTime: string;
      attendees: Array<{
        email: string;
        name: string;
        timeZone: string;
      }>;
      organizer: {
        email: string;
        name: string;
        timeZone: string;
      };
      location?: string;
      status: 'ACCEPTED' | 'CANCELLED' | 'REJECTED' | 'PENDING';
      metadata?: Record<string, any>;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    
    // Parse the webhook payload
    const webhookData: CalComWebhookPayload = JSON.parse(body)
    
    console.log('Received Cal.com webhook:', {
      event: webhookData.triggerEvent,
      bookingId: webhookData.payload.booking.id,
      bookingUid: webhookData.payload.booking.uid,
      status: webhookData.payload.booking.status,
      startTime: webhookData.payload.booking.startTime
    })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Log the webhook event
    await supabase
      .from('cal_com_webhooks')
      .insert({
        event_type: webhookData.triggerEvent,
        booking_id: webhookData.payload.booking.uid,
        event_data: webhookData,
        processed: false
      })

    // Process the webhook based on event type
    const booking = webhookData.payload.booking
    let sessionUpdate: any = {}
    let newStatus = 'pending'

    switch (webhookData.triggerEvent) {
      case 'BOOKING_CREATED':
        newStatus = 'confirmed'
        sessionUpdate = {
          status: newStatus,
          cal_com_booking_id: booking.uid,
          meeting_link: booking.location || `https://cal.com/meeting/${booking.uid}`
        }
        break

      case 'BOOKING_CANCELLED':
        newStatus = 'cancelled'
        sessionUpdate = {
          status: newStatus
        }
        break

      case 'BOOKING_RESCHEDULED':
        newStatus = 'confirmed'
        sessionUpdate = {
          status: newStatus,
          session_date: booking.startTime,
          cal_com_booking_id: booking.uid,
          meeting_link: booking.location || `https://cal.com/meeting/${booking.uid}`
        }
        break

      default:
        console.log(`Unhandled event type: ${webhookData.triggerEvent}`)
        return new Response('Event type not handled', { 
          status: 200, 
          headers: corsHeaders 
        })
    }

    // Find the coaching session by matching the booking time and attendee email
    const sessionDate = new Date(booking.startTime)
    const attendeeEmails = booking.attendees.map(a => a.email)
    
    console.log('Looking for session with:', {
      sessionDate: sessionDate.toISOString(),
      attendeeEmails
    })

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
      .eq('booking_id', booking.uid)

    console.log('Successfully processed Cal.com webhook:', {
      bookingId: booking.uid,
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

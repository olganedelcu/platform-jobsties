
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract event details
    const eventType = webhookData.triggerEvent || webhookData.type || 'unknown'
    const bookingData = webhookData.payload?.booking || webhookData.booking || webhookData.payload || webhookData
    
    console.log('Event type:', eventType)
    console.log('Booking data:', JSON.stringify(bookingData, null, 2))

    // Store the raw webhook for debugging
    await supabase
      .from('cal_com_webhooks')
      .insert({
        event_type: eventType,
        booking_id: bookingData?.uid || bookingData?.id || bookingData?.bookingId || 'unknown',
        event_data: webhookData,
        processed: false
      })

    // Check if we have valid booking data
    if (!bookingData || !bookingData.startTime) {
      console.log('No valid booking data found, webhook logged for analysis')
      return new Response('Webhook logged successfully (no valid booking data)', {
        status: 200,
        headers: corsHeaders
      })
    }

    // Process the webhook based on event type
    switch (eventType) {
      case 'BOOKING_CREATED':
        await handleBookingCreated(supabase, bookingData)
        break

      case 'BOOKING_CANCELLED':
        await handleBookingCancelled(supabase, bookingData)
        break

      case 'BOOKING_RESCHEDULED':
        await handleBookingRescheduled(supabase, bookingData)
        break

      default:
        console.log(`Unhandled event type: ${eventType}`)
        return new Response('Event type not handled but logged', { 
          status: 200, 
          headers: corsHeaders 
        })
    }

    // Mark webhook as processed
    await supabase
      .from('cal_com_webhooks')
      .update({ processed: true })
      .eq('booking_id', bookingData.uid || bookingData.id || bookingData.bookingId)

    console.log('Successfully processed Cal.com webhook')

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

async function handleBookingCreated(supabase: any, bookingData: any) {
  console.log('Processing BOOKING_CREATED event')
  
  // Extract attendee information
  const attendees = bookingData.attendees || []
  let attendeeEmail = attendees.length > 0 ? attendees[0].email : null
  let attendeeName = attendees.length > 0 ? attendees[0].name : null
  
  // Also check responses for the actual booking details
  if (bookingData.responses?.email?.value) {
    attendeeEmail = bookingData.responses.email.value
  }
  
  if (bookingData.responses?.name?.value) {
    attendeeName = bookingData.responses.name.value
  }
  
  console.log('Looking for attendee:', { email: attendeeEmail, name: attendeeName })
  
  if (!attendeeEmail && !attendeeName) {
    console.log('No attendee information found, cannot create session')
    return
  }

  // Find the user profile - try multiple approaches
  let userProfile = null
  
  // First try to find by email if available
  if (attendeeEmail) {
    console.log('Trying to find user by email:', attendeeEmail)
    
    // Try exact email match
    const { data: exactProfile } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('email', attendeeEmail)
      .single()

    if (exactProfile) {
      userProfile = exactProfile
      console.log('Found user profile with exact email match:', userProfile)
    } else {
      // Try case-insensitive email match
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
      
      if (allProfiles) {
        userProfile = allProfiles.find(profile => 
          profile.email.toLowerCase() === attendeeEmail.toLowerCase()
        )
        
        if (userProfile) {
          console.log('Found user profile with case-insensitive email match:', userProfile)
        }
      }
    }
  }
  
  // If email didn't work, try to find by name matching
  if (!userProfile && attendeeName) {
    console.log('Trying to find user by name:', attendeeName)
    
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
    
    if (allProfiles) {
      // Try to match by full name or last name
      const nameParts = attendeeName.toLowerCase().split(' ')
      const lastName = nameParts[nameParts.length - 1]
      
      userProfile = allProfiles.find(profile => {
        const fullName = `${profile.first_name} ${profile.last_name}`.toLowerCase()
        const profileLastName = profile.last_name.toLowerCase()
        
        return fullName.includes(attendeeName.toLowerCase()) || 
               profileLastName === lastName ||
               attendeeName.toLowerCase().includes(profileLastName)
      })
      
      if (userProfile) {
        console.log('Found user profile by name matching:', userProfile)
      }
    }
  }

  // If still no profile found, log available profiles for debugging
  if (!userProfile) {
    console.log('No user profile found for attendee:', { email: attendeeEmail, name: attendeeName })
    
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
    
    if (allProfiles) {
      console.log('Available profiles:', allProfiles.map(p => ({
        name: `${p.first_name} ${p.last_name}`,
        email: p.email,
        role: p.role
      })))
    }
    
    return
  }

  // Find Ana's profile (the coach)
  const { data: coachProfile, error: coachError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'ana@jobsties.com')
    .eq('role', 'COACH')
    .single()

  if (coachError || !coachProfile) {
    console.log('Coach profile not found')
    return
  }

  // Extract meeting details
  const sessionDate = new Date(bookingData.startTime)
  const meetingLink = bookingData.metadata?.videoCallUrl || `https://meet.google.com/dcr-dbrn-bvx`
  const sessionType = bookingData.eventTitle || bookingData.title || '1-on-1 Session'
  const duration = bookingData.length || 30
  const notes = bookingData.additionalNotes || bookingData.description || ''

  console.log('Creating session with data:', {
    mentee_id: userProfile.id,
    coach_id: coachProfile.id,
    session_type: sessionType,
    session_date: sessionDate.toISOString(),
    duration: duration,
    notes: notes,
    status: 'confirmed',
    meeting_link: meetingLink,
    preferred_coach: 'Ana Nedelcu',
    cal_com_booking_id: bookingData.uid || bookingData.id || bookingData.bookingId
  })

  // Create the coaching session
  const { data: newSession, error: sessionError } = await supabase
    .from('coaching_sessions')
    .insert({
      mentee_id: userProfile.id,
      coach_id: coachProfile.id,
      session_type: sessionType,
      session_date: sessionDate.toISOString(),
      duration: duration,
      notes: notes,
      status: 'confirmed',
      meeting_link: meetingLink,
      preferred_coach: 'Ana Nedelcu',
      cal_com_booking_id: bookingData.uid || bookingData.id || bookingData.bookingId
    })
    .select()
    .single()

  if (sessionError) {
    console.error('Error creating coaching session:', sessionError)
    return
  }

  console.log('Successfully created coaching session:', newSession)
}

async function handleBookingCancelled(supabase: any, bookingData: any) {
  console.log('Processing BOOKING_CANCELLED event')
  
  const bookingId = bookingData.uid || bookingData.id || bookingData.bookingId
  
  // Find and delete the coaching session
  const { error } = await supabase
    .from('coaching_sessions')
    .delete()
    .eq('cal_com_booking_id', bookingId)

  if (error) {
    console.error('Error cancelling session:', error)
  } else {
    console.log('Successfully cancelled session for booking:', bookingId)
  }
}

async function handleBookingRescheduled(supabase: any, bookingData: any) {
  console.log('Processing BOOKING_RESCHEDULED event')
  
  const bookingId = bookingData.uid || bookingData.id || bookingData.bookingId
  const newSessionDate = new Date(bookingData.startTime)
  const meetingLink = bookingData.metadata?.videoCallUrl || `https://meet.google.com/dcr-dbrn-bvx`
  
  // Update the coaching session
  const { error } = await supabase
    .from('coaching_sessions')
    .update({
      session_date: newSessionDate.toISOString(),
      meeting_link: meetingLink,
      status: 'confirmed'
    })
    .eq('cal_com_booking_id', bookingId)

  if (error) {
    console.error('Error rescheduling session:', error)
  } else {
    console.log('Successfully rescheduled session for booking:', bookingId)
  }
}

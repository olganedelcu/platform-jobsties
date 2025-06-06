
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SessionNotificationRequest {
  type: 'session_booked';
  data: {
    menteeEmail: string;
    menteeName: string;
    sessionType: string;
    sessionDate: string;
    sessionTime: string;
    duration: number;
    notes?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: SessionNotificationRequest = await req.json();

    if (type === 'session_booked') {
      // Send notification email to Ana (coach) - using the verified email
      const coachEmailResponse = await resend.emails.send({
        from: "JobsTies Booking <onboarding@resend.dev>",
        to: ["ana@jobsties.com"], // Using the verified email address
        subject: `New Session Booking: ${data.sessionType}`,
        html: `
          <h1>New Session Booking</h1>
          <p><strong>Mentee:</strong> ${data.menteeName} (${data.menteeEmail})</p>
          <p><strong>Session Type:</strong> ${data.sessionType}</p>
          <p><strong>Date:</strong> ${data.sessionDate}</p>
          <p><strong>Time:</strong> ${data.sessionTime}</p>
          <p><strong>Duration:</strong> ${data.duration} minutes</p>
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          <br>
          <p>Please confirm this session through the JobsTies coach portal.</p>
        `,
      });

      console.log("Coach notification sent:", coachEmailResponse);

      // For now, we'll only send to the coach since Resend requires domain verification
      // to send to arbitrary email addresses. In production, you'll need to verify
      // your domain at https://resend.com/domains
      
      if (coachEmailResponse.error) {
        console.error("Error sending coach notification:", coachEmailResponse.error);
        throw new Error(`Failed to send coach notification: ${coachEmailResponse.error.message}`);
      }

      return new Response(JSON.stringify({ 
        success: true,
        coachEmailId: coachEmailResponse.data?.id,
        message: "Coach notification sent successfully. Mentee confirmation disabled until domain verification."
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid notification type" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-session-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

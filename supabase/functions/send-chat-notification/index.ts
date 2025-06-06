
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChatNotificationRequest {
  menteeEmail: string;
  menteeName: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { menteeEmail, menteeName, message }: ChatNotificationRequest = await req.json();

    // Send notification email to Ana
    const emailResponse = await resend.emails.send({
      from: "JobsTies Chat <onboarding@resend.dev>",
      to: ["ana@jobsties.com"],
      subject: `New Message from ${menteeName}`,
      html: `
        <h1>New Chat Message Received</h1>
        <p><strong>From:</strong> ${menteeName} (${menteeEmail})</p>
        <br>
        <h2>Message:</h2>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4f46e5; margin: 15px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <br>
        <p>You can reply to this message through your JobsTies coach dashboard.</p>
        <p><a href="https://platform.jobsties.com/coach/chat" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Coach Dashboard</a></p>
      `,
    });

    if (emailResponse.error) {
      console.error("Error sending notification:", emailResponse.error);
      throw new Error(`Failed to send notification: ${emailResponse.error.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true,
      emailId: emailResponse.data?.id,
      message: "Chat notification sent successfully."
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-chat-notification function:", error);
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

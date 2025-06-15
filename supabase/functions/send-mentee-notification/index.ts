
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  menteeEmail: string;
  menteeName: string;
  actionType: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
  actionDetails: {
    jobTitle?: string;
    companyName?: string;
    fileName?: string;
    messagePreview?: string;
    todoTitle?: string;
    count?: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== EMAIL NOTIFICATION DEBUG START ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);
    
    let parsedBody: NotificationRequest;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid JSON in request body");
    }
    
    const { menteeEmail, menteeName, actionType, actionDetails } = parsedBody;
    
    console.log("Parsed notification request:", {
      menteeEmail,
      menteeName,
      actionType,
      actionDetails
    });

    if (!menteeEmail || !actionType) {
      const error = "Email and action type are required";
      console.error("Validation error:", error);
      throw new Error(error);
    }

    // Check if RESEND_API_KEY is available
    const resendKey = Deno.env.get("RESEND_API_KEY");
    console.log("RESEND_API_KEY available:", !!resendKey);
    console.log("RESEND_API_KEY length:", resendKey?.length || 0);

    // Generate email content based on action type
    let subject = "";
    let htmlContent = "";

    switch (actionType) {
      case 'job_recommendation':
        subject = `New Job Recommendation from Ana`;
        htmlContent = `
          <h1>New Job Recommendation!</h1>
          <p>Hi ${menteeName},</p>
          <p>Ana has sent you a new job recommendation:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4f46e5; margin: 15px 0;">
            <strong>${actionDetails.jobTitle}</strong> at <strong>${actionDetails.companyName}</strong>
          </div>
          <p>Log in to your JobsTies dashboard to view the full details and apply!</p>
          <p>Best of luck with your job search!</p>
          <hr>
          <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
        `;
        break;

      case 'file_upload':
        subject = `New File from Ana`;
        htmlContent = `
          <h1>New File Available!</h1>
          <p>Hi ${menteeName},</p>
          <p>Ana has uploaded a new file for you:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
            📄 <strong>${actionDetails.fileName}</strong>
          </div>
          <p>Log in to your JobsTies dashboard to download and review the file.</p>
          <p>Keep up the great work!</p>
          <hr>
          <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
        `;
        break;

      case 'message':
        subject = `New Message from Ana`;
        htmlContent = `
          <h1>New Message!</h1>
          <p>Hi ${menteeName},</p>
          <p>Ana has sent you a new message:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
            ${actionDetails.messagePreview}
          </div>
          <p>Log in to your JobsTies dashboard to read the full message and reply.</p>
          <p>Stay connected!</p>
          <hr>
          <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
        `;
        break;

      case 'todo_assignment':
        const todoCount = actionDetails.count || 1;
        subject = `New Task${todoCount > 1 ? 's' : ''} from Ana`;
        htmlContent = `
          <h1>New Task${todoCount > 1 ? 's' : ''} Assigned!</h1>
          <p>Hi ${menteeName},</p>
          <p>Ana has assigned ${todoCount > 1 ? `${todoCount} new tasks` : 'a new task'} to help with your career journey:</p>
          ${actionDetails.todoTitle ? `
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #8b5cf6; margin: 15px 0;">
            ✓ <strong>${actionDetails.todoTitle}</strong>
          </div>
          ` : ''}
          <p>Log in to your JobsTies dashboard to view ${todoCount > 1 ? 'all tasks' : 'the task'} and mark ${todoCount > 1 ? 'them' : 'it'} as complete when done.</p>
          <p>You've got this!</p>
          <hr>
          <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
        `;
        break;

      default:
        console.error("Unknown action type:", actionType);
        throw new Error("Unknown action type");
    }

    console.log("Email content generated:", { subject, htmlContentLength: htmlContent.length });

    console.log(`Attempting to send ${actionType} notification to ${menteeEmail}`);

    // Prepare email data using the default Resend domain
    const emailData = {
      from: "Ana - JobsTies <onboarding@resend.dev>",
      to: [menteeEmail],
      subject: subject,
      html: htmlContent,
    };
    
    console.log("Email data prepared:", emailData);

    // Send notification email using the default verified domain
    const emailResponse = await resend.emails.send(emailData);

    console.log("Resend API response:", emailResponse);

    if (emailResponse.error) {
      console.error("Resend error details:", emailResponse.error);
      throw new Error(`Failed to send notification: ${emailResponse.error.message}`);
    }

    console.log("Email sent successfully:", {
      id: emailResponse.data?.id,
      actionType,
      recipient: menteeEmail
    });

    console.log("=== EMAIL NOTIFICATION DEBUG END ===");

    return new Response(JSON.stringify({ 
      success: true,
      emailId: emailResponse.data?.id,
      message: "Notification sent successfully.",
      debugInfo: {
        actionType,
        recipient: menteeEmail,
        subject
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== EMAIL NOTIFICATION ERROR ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("=== END ERROR ===");
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

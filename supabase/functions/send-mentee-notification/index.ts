
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { parseRequestBody, validateRequest } from './request-validator.ts';
import { isEmailVerified, createSkippedResponse } from './email-verification.ts';
import { generateEmailContent } from './email-content-generator.ts';
import { sendEmail, checkResendConfiguration } from './email-sender.ts';
import { createCorsResponse, createSuccessResponse, createErrorResponse } from './response-helpers.ts';

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return createCorsResponse();
  }

  try {
    console.log("=== EMAIL NOTIFICATION DEBUG START ===");
    
    const parsedBody = await parseRequestBody(req);
    console.log("Parsed notification request:", parsedBody);
    
    validateRequest(parsedBody);
    
    const { menteeEmail, menteeName, actionType, actionDetails } = parsedBody;

    checkResendConfiguration();

    // Check if email is verified for sending
    if (!isEmailVerified(menteeEmail)) {
      return createSkippedResponse(menteeEmail, actionType);
    }

    // Generate email content based on action type
    const { subject, htmlContent } = generateEmailContent(actionType, menteeName, actionDetails);
    console.log("Email content generated:", { subject, htmlContentLength: htmlContent.length });

    console.log(`Attempting to send ${actionType} notification to ${menteeEmail}`);

    // Prepare email data using the default Resend domain
    const emailData = {
      from: "Ana - JobsTies <onboarding@resend.dev>",
      to: [menteeEmail],
      subject: subject,
      html: htmlContent,
    };

    // Send notification email
    const emailResponse = await sendEmail(emailData);

    console.log("Email sent successfully:", {
      id: emailResponse.data?.id,
      actionType,
      recipient: menteeEmail
    });

    console.log("=== EMAIL NOTIFICATION DEBUG END ===");

    return createSuccessResponse(emailResponse.data?.id, actionType, menteeEmail, subject);

  } catch (error: any) {
    return createErrorResponse(error);
  }
};

serve(handler);

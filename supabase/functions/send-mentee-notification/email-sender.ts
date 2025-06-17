
import { Resend } from "npm:resend@2.0.0";
import { EmailData } from './types.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export const sendEmail = async (emailData: EmailData) => {
  console.log("Email data prepared:", emailData);
  
  const emailResponse = await resend.emails.send(emailData);
  console.log("Resend API response:", emailResponse);

  if (emailResponse.error) {
    console.error("Resend error details:", emailResponse.error);
    throw new Error(`Failed to send notification: ${emailResponse.error.message}`);
  }

  return emailResponse;
};

export const checkResendConfiguration = (): void => {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  console.log("RESEND_API_KEY available:", !!resendKey);
  console.log("RESEND_API_KEY length:", resendKey?.length || 0);
};

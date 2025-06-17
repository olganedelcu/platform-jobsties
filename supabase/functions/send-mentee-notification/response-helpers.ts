
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export const createCorsResponse = () => {
  return new Response(null, { headers: corsHeaders });
};

export const createSuccessResponse = (emailId: string | undefined, actionType: string, recipient: string, subject: string) => {
  return Response.json({
    success: true,
    emailId,
    message: "Notification sent successfully.",
    debugInfo: {
      actionType,
      recipient,
      subject
    }
  }, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
};

export const createErrorResponse = (error: any) => {
  console.error("=== EMAIL NOTIFICATION ERROR ===");
  console.error("Error details:", error);
  console.error("Error message:", error.message);
  console.error("Error stack:", error.stack);
  console.error("=== END ERROR ===");
  
  return Response.json({
    error: error.message,
    details: error.stack,
    timestamp: new Date().toISOString()
  }, {
    status: 500,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
};

export { corsHeaders };

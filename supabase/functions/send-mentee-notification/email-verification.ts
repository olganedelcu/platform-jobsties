
export const getVerifiedEmails = (): string[] => {
  return ['ana@jobsties.com'];
};

export const isEmailVerified = (email: string): boolean => {
  const verifiedEmails = getVerifiedEmails();
  return verifiedEmails.includes(email);
};

export const createSkippedResponse = (email: string, actionType: string) => {
  console.log(`⚠️ Skipping email to ${email} - not in verified emails list. To send to this email, please verify a custom domain at resend.com/domains`);
  
  return Response.json({
    success: true,
    skipped: true,
    message: `Notification skipped - ${email} is not in verified emails list. Please verify a custom domain to send to all mentees.`,
    debugInfo: {
      actionType,
      recipient: email,
      reason: "unverified_recipient"
    }
  }, { status: 200 });
};

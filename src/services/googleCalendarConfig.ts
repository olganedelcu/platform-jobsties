
export const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/calendar';

// We'll get this from the environment/config - you need to set this in your deployment
export const getGoogleClientId = () => {
  // In production, this should come from environment variables
  // For now, we'll need to set this in the Supabase edge function or as a runtime config
  return window.location.hostname.includes('localhost') 
    ? 'your-local-google-client-id' 
    : 'your-production-google-client-id';
};

export const getRedirectUri = () => {
  return `${window.location.origin}/google-auth-callback`;
};

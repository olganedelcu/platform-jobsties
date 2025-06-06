
export const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/calendar';

// Get Google Client ID from our edge function
export const getGoogleClientId = async (): Promise<string> => {
  try {
    const response = await fetch('/api/google-config');
    const data = await response.json();
    return data.clientId;
  } catch (error) {
    console.error('Failed to get Google Client ID:', error);
    throw new Error('Google Calendar integration is not properly configured');
  }
};

export const getRedirectUri = () => {
  return `${window.location.origin}/google-auth-callback`;
};


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the Google OAuth callback
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('Google OAuth error:', error);
          navigate('/coach/settings?error=oauth_failed');
          return;
        }

        if (code) {
          // In a real implementation, you would send this code to your backend
          // to exchange it for access and refresh tokens
          console.log('Google OAuth code received:', code);
          navigate('/coach/settings?success=calendar_connected');
        } else {
          navigate('/coach/settings');
        }
      } catch (error) {
        console.error('Error handling Google OAuth callback:', error);
        navigate('/coach/settings?error=callback_failed');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Connecting to Google Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-600 text-center">
            Please wait while we connect your Google Calendar...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuthCallback;

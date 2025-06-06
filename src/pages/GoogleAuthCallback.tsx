
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { GoogleCalendarService } from '@/services/googleCalendarService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { toast } = useToast();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        throw new Error(`Authentication error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Handle the auth callback
      await GoogleCalendarService.handleAuthCallback(code, user.id);

      setStatus('success');
      toast({
        title: "Google Calendar Connected",
        description: "Your Google Calendar has been successfully connected!",
      });

      // Redirect back to sessions page after a short delay
      setTimeout(() => {
        navigate('/sessions');
      }, 2000);

    } catch (error) {
      console.error('Google Calendar auth error:', error);
      setStatus('error');
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect Google Calendar",
        variant: "destructive",
      });

      // Redirect back to sessions page after a short delay
      setTimeout(() => {
        navigate('/sessions');
      }, 3000);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold">Connecting Google Calendar...</h2>
            <p className="text-gray-600">Please wait while we set up your calendar integration.</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <h2 className="text-xl font-semibold text-green-800">Successfully Connected!</h2>
            <p className="text-gray-600">Your Google Calendar is now connected. Redirecting...</p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800">Connection Failed</h2>
            <p className="text-gray-600">There was an error connecting your calendar. Redirecting...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;

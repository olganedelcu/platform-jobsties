
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarService } from '@/services/googleCalendarService';

interface GoogleCalendarIntegrationProps {
  userId: string;
  onConnectionChange?: (connected: boolean) => void;
}

const GoogleCalendarIntegration = ({ userId, onConnectionChange }: GoogleCalendarIntegrationProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, [userId]);

  const checkConnection = async () => {
    try {
      const connected = await GoogleCalendarService.isConnected(userId);
      setIsConnected(connected);
      onConnectionChange?.(connected);
    } catch (error) {
      console.error('Error checking Google Calendar connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    const authUrl = GoogleCalendarService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    // Note: In a real implementation, you might want to revoke the token
    // and remove it from the database
    toast({
      title: "Disconnect Google Calendar",
      description: "This feature will be implemented soon.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 animate-pulse" />
            <span>Checking Google Calendar connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Google Calendar Integration</span>
          {isConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">Connected to Google Calendar</p>
                  <p className="text-green-600 text-sm">
                    Your sessions will be automatically synced with your calendar.
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Disconnect Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                Connect your Google Calendar to automatically create calendar events for your coaching sessions.
              </p>
            </div>
            <Button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Connect Google Calendar</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarIntegration;

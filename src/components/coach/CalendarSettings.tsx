
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CoachCalendarService } from '@/services/coachCalendarService';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface CalendarSettings {
  google_calendar_connected: boolean;
  sync_enabled: boolean;
  last_sync_at?: string;
}

interface CalendarSettingsProps {
  settings: CalendarSettings;
  onSettingsUpdate: () => void;
  coachId: string;
}

const CalendarSettings = ({ settings, onSettingsUpdate, coachId }: CalendarSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConnectGoogleCalendar = async () => {
    try {
      setLoading(true);
      const authUrl = await CoachCalendarService.getGoogleAuthUrl();
      window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Listen for auth completion
      const checkConnection = setInterval(async () => {
        try {
          const isConnected = await CoachCalendarService.checkGoogleConnection(coachId);
          if (isConnected) {
            clearInterval(checkConnection);
            onSettingsUpdate();
            toast({
              title: "Success",
              description: "Google Calendar connected successfully"
            });
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }, 2000);

      // Stop checking after 2 minutes
      setTimeout(() => clearInterval(checkConnection), 120000);
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      toast({
        title: "Error",
        description: "Failed to connect Google Calendar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    try {
      setLoading(true);
      await CoachCalendarService.disconnectGoogleCalendar(coachId);
      onSettingsUpdate();
      toast({
        title: "Success",
        description: "Google Calendar disconnected"
      });
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect Google Calendar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSync = async (enabled: boolean) => {
    try {
      setLoading(true);
      await CoachCalendarService.updateSyncSettings(coachId, enabled);
      onSettingsUpdate();
      toast({
        title: "Success",
        description: `Auto-sync ${enabled ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error('Error updating sync settings:', error);
      toast({
        title: "Error",
        description: "Failed to update sync settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Calendar Connection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Google Calendar Integration</Label>
              <p className="text-sm text-gray-600">
                Connect your Google Calendar to automatically sync your availability
              </p>
            </div>
            {settings.google_calendar_connected ? (
              <Button
                variant="outline"
                onClick={handleDisconnectGoogleCalendar}
                disabled={loading}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={handleConnectGoogleCalendar}
                disabled={loading}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Google Calendar
              </Button>
            )}
          </div>

          {!settings.google_calendar_connected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To use Google Calendar integration, you need to connect your Google account. 
                This will allow the system to sync your calendar events and prevent double-booking.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Auto-sync Settings */}
        {settings.google_calendar_connected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Automatic Sync</Label>
                <p className="text-sm text-gray-600">
                  Automatically sync calendar events every hour
                </p>
              </div>
              <Switch
                checked={settings.sync_enabled}
                onCheckedChange={handleToggleSync}
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Last Sync Info */}
        {settings.google_calendar_connected && settings.last_sync_at && (
          <div className="text-sm text-gray-600">
            Last synchronized: {new Date(settings.last_sync_at).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarSettings;

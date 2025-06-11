
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
      
      // Start the OAuth flow
      await CoachCalendarService.connectGoogleCalendar();
      
      // Check if connection was successful
      const isConnected = await CoachCalendarService.checkGoogleConnection(coachId);
      
      if (isConnected) {
        // Update calendar settings to reflect connection
        await CoachCalendarService.updateSyncSettings(coachId, true);
        onSettingsUpdate();
        
        toast({
          title: "Success",
          description: "Google Calendar connected successfully! Your calendar will now sync automatically."
        });
      } else {
        toast({
          title: "Connection incomplete",
          description: "Please try connecting again or check if you granted all required permissions.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      toast({
        title: "Error",
        description: "Failed to connect Google Calendar. Please try again.",
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {loading ? 'Connecting...' : 'Connect Google Calendar'}
              </Button>
            )}
          </div>

          {!settings.google_calendar_connected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Click "Connect Google Calendar" to log into your Google account and grant permission. 
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

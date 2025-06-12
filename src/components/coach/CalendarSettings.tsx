
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
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
  const { executeWithErrorHandling } = useErrorHandler();

  const handleConnectGoogleCalendar = async () => {
    if (!coachId) {
      toast({
        title: "Error",
        description: "Coach information not available",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const success = await executeWithErrorHandling(
      async () => {
        await CoachCalendarService.connectGoogleCalendar();
        
        const isConnected = await CoachCalendarService.checkGoogleConnection(coachId);
        
        if (isConnected) {
          await CoachCalendarService.updateSyncSettings(coachId, true);
          onSettingsUpdate();
          return true;
        } else {
          throw new Error('Connection verification failed');
        }
      },
      { 
        component: 'CalendarSettings', 
        action: 'connectGoogleCalendar',
        userId: coachId 
      },
      { showToast: false }
    );

    if (success) {
      toast({
        title: "Success",
        description: "Google Calendar connected successfully"
      });
    }
    
    setLoading(false);
  };

  const handleDisconnectGoogleCalendar = async () => {
    if (!coachId) {
      toast({
        title: "Error",
        description: "Coach information not available",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const success = await executeWithErrorHandling(
      async () => {
        await CoachCalendarService.disconnectGoogleCalendar(coachId);
        onSettingsUpdate();
        return true;
      },
      { 
        component: 'CalendarSettings', 
        action: 'disconnectGoogleCalendar',
        userId: coachId 
      },
      { showToast: false }
    );

    if (success) {
      toast({
        title: "Success",
        description: "Google Calendar disconnected"
      });
    }
    
    setLoading(false);
  };

  const handleToggleSync = async (enabled: boolean) => {
    if (!coachId) {
      toast({
        title: "Error",
        description: "Coach information not available",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const success = await executeWithErrorHandling(
      async () => {
        await CoachCalendarService.updateSyncSettings(coachId, enabled);
        onSettingsUpdate();
        return true;
      },
      { 
        component: 'CalendarSettings', 
        action: 'toggleSync',
        userId: coachId 
      },
      { showToast: false }
    );

    if (success) {
      toast({
        title: "Success",
        description: `Auto-sync ${enabled ? 'enabled' : 'disabled'}`
      });
    }
    
    setLoading(false);
  };

  const formatLastSyncTime = (lastSyncAt?: string): string => {
    if (!lastSyncAt) return 'Never';
    
    try {
      return new Date(lastSyncAt).toLocaleString();
    } catch (error) {
      return 'Unknown';
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
                {loading ? 'Disconnecting...' : 'Disconnect'}
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
                Click "Connect Google Calendar" to authorize access. 
                This enables calendar synchronization and prevents scheduling conflicts.
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
        {settings.google_calendar_connected && (
          <div className="text-sm text-gray-600">
            Last synchronized: {formatLastSyncTime(settings.last_sync_at)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarSettings;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import GoogleCalendarIntegration from '@/components/GoogleCalendarIntegration';

interface CalendarIntegrationBannerProps {
  userId?: string;
  isCalendarConnected: boolean;
  showCalendarIntegration: boolean;
  onShowIntegration: () => void;
  onConnectionChange: (connected: boolean) => void;
}

const CalendarIntegrationBanner = ({ 
  userId, 
  isCalendarConnected, 
  showCalendarIntegration, 
  onShowIntegration, 
  onConnectionChange 
}: CalendarIntegrationBannerProps) => {
  if (!userId) return null;

  return (
    <div className="space-y-4">
      {!showCalendarIntegration && !isCalendarConnected && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium">Want automatic calendar sync?</p>
              <p className="text-amber-600 text-sm">Connect Google Calendar to automatically create events for your sessions.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onShowIntegration}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Connect
            </Button>
          </div>
        </div>
      )}

      {showCalendarIntegration && (
        <GoogleCalendarIntegration
          userId={userId}
          onConnectionChange={onConnectionChange}
        />
      )}

      {isCalendarConnected && !showCalendarIntegration && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Google Calendar connected</p>
              <p>Your session will be automatically added to your calendar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarIntegrationBanner;

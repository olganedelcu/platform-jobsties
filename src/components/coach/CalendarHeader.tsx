
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Settings, RefreshCw } from 'lucide-react';

interface CalendarHeaderProps {
  onAddAvailability: () => void;
  onShowSettings: () => void;
  onSyncCalendar: () => void;
  isGoogleConnected: boolean;
  loading: boolean;
}

const CalendarHeader = ({ 
  onAddAvailability, 
  onShowSettings, 
  onSyncCalendar, 
  isGoogleConnected, 
  loading 
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Calendar & Availability</h2>
        <p className="text-gray-600">Manage your schedule and availability for mentee sessions</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddAvailability}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Add Availability
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowSettings}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        {isGoogleConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSyncCalendar}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;

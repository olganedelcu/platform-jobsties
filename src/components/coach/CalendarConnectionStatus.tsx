
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react';

interface CalendarConnectionStatusProps {
  isConnected: boolean;
  lastSyncAt?: string;
}

const CalendarConnectionStatus = ({ isConnected, lastSyncAt }: CalendarConnectionStatusProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="font-medium">Google Calendar Integration</p>
              <p className="text-sm text-gray-600">
                {isConnected ? 
                  `Last synced: ${lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Never'}` :
                  'Connect your Google Calendar to manage availability'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Not Connected"}
            </Badge>
            {isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://calendar.google.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Calendar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarConnectionStatus;

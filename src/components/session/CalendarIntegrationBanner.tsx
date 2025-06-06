
import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { CoachGoogleCalendarService } from '@/services/coachGoogleCalendarService';

const CalendarIntegrationBanner = () => {
  const [isCoachCalendarConnected, setIsCoachCalendarConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCoachCalendarConnection();
  }, []);

  const checkCoachCalendarConnection = async () => {
    try {
      const connected = await CoachGoogleCalendarService.isCoachCalendarConnected();
      setIsCoachCalendarConnected(connected);
    } catch (error) {
      console.error('Error checking coach calendar connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 animate-pulse text-gray-400" />
          <span className="text-gray-600">Checking calendar integration...</span>
        </div>
      </div>
    );
  }

  if (isCoachCalendarConnected) {
    return (
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div className="text-sm text-green-800">
            <p className="font-medium">Google Calendar integration active</p>
            <p>Your session will be automatically added to Ana's calendar and you'll receive an invite</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-amber-600" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">Calendar integration not configured</p>
          <p>Sessions will be created but calendar invites are not available at this time</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegrationBanner;


import React from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const CalendarIntegrationBanner = () => {
  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2">
        <Mail className="h-5 w-5 text-blue-600" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Email notifications enabled</p>
          <p>Ana will be notified via email when you book a session. She'll then confirm your session and send you the meeting link directly.</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegrationBanner;

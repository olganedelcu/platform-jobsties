
import React from 'react';
import { Video } from 'lucide-react';

const SessionMeetingInfo = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
      <Video className="h-5 w-5 text-blue-600" />
      <div className="text-sm text-blue-800">
        <p className="font-medium">Session will be conducted via video call</p>
        <p>You'll receive a meeting link once your session is confirmed</p>
      </div>
    </div>
  );
};

export default SessionMeetingInfo;

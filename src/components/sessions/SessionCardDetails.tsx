
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Video, ExternalLink } from 'lucide-react';

interface SessionCardDetailsProps {
  sessionDate: string;
  duration: number;
  preferredCoach?: string;
  meetingLink?: string;
  status: string;
  isUpcoming: boolean;
}

const SessionCardDetails = ({
  sessionDate,
  duration,
  preferredCoach,
  meetingLink,
  status,
  isUpcoming
}: SessionCardDetailsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleJoinMeeting = () => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3 text-gray-700">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calendar className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{formatDate(sessionDate)}</p>
          <p className="text-xs text-gray-500">Session date</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 text-gray-700">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Clock className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{formatTime(sessionDate)}</p>
          <p className="text-xs text-gray-500">{duration} minutes</p>
        </div>
      </div>
      
      {preferredCoach && (
        <div className="flex items-center space-x-3 text-gray-700">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{preferredCoach}</p>
            <p className="text-xs text-gray-500">Your coach</p>
          </div>
        </div>
      )}
      
      {meetingLink && isUpcoming && (
        <div className="flex items-center space-x-3 text-gray-700">
          <div className="p-2 bg-green-50 rounded-lg">
            <Video className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-600 text-sm">Video call ready</p>
            <p className="text-xs text-gray-500">Meeting link available</p>
          </div>
          {status === 'confirmed' && (
            <Button
              size="sm"
              onClick={handleJoinMeeting}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Join
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionCardDetails;

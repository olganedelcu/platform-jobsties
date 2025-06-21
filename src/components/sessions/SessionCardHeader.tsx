
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SessionCardHeaderProps {
  sessionType: string;
  status: string;
  calComBookingId?: string;
  isNextSession?: boolean;
  menteeFirstName?: string;
}

const SessionCardHeader = ({ 
  sessionType, 
  status, 
  calComBookingId, 
  isNextSession = false,
  menteeFirstName 
}: SessionCardHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Generate the meeting title in the format "Ana Nedelcu / [Mentee First Name]"
  const meetingTitle = menteeFirstName ? `Ana Nedelcu / ${menteeFirstName}` : sessionType;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{meetingTitle}</h3>
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(status)} font-medium border text-xs px-2 py-1`}>
            {status}
          </Badge>
          {calComBookingId && (
            <Badge variant="outline" className="text-white border-white/50 bg-white/10 text-xs px-2 py-1">
              Cal.com
            </Badge>
          )}
        </div>
      </div>
      <p className="text-blue-100 text-sm">Professional coaching session</p>
    </div>
  );
};

export default SessionCardHeader;

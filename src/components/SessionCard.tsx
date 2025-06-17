
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, ExternalLink } from 'lucide-react';
import { Session } from '@/types/sessions';

interface SessionCardProps {
  session: Session;
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
  isNextSession?: boolean;
}

const SessionCard = ({ session, onReschedule, onCancel, isNextSession = false }: SessionCardProps) => {
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

  const handleJoinMeeting = () => {
    if (session.meeting_link) {
      window.open(session.meeting_link, '_blank');
    }
  };

  const isUpcoming = new Date(session.session_date) >= new Date();

  if (isNextSession) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Blue Header for Next Session */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{session.session_type}</h3>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(session.status)} font-medium border text-xs px-3 py-1`}>
                {session.status}
              </Badge>
              {session.cal_com_booking_id && (
                <Badge variant="outline" className="text-white border-white/50 bg-white/10 text-xs px-3 py-1">
                  Cal.com
                </Badge>
              )}
            </div>
          </div>
          <p className="text-blue-100 text-sm">Professional coaching session</p>
        </div>
        
        {/* White Content */}
        <div className="p-6 space-y-6">
          {/* Session Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{formatDate(session.session_date)}</p>
                <p className="text-sm text-gray-500">Session date</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{formatTime(session.session_date)}</p>
                <p className="text-sm text-gray-500">{session.duration} minutes</p>
              </div>
            </div>
            
            {session.preferred_coach && (
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{session.preferred_coach}</p>
                  <p className="text-sm text-gray-500">Your coach</p>
                </div>
              </div>
            )}
            
            {session.meeting_link && isUpcoming && (
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-600">Video call ready</p>
                  <p className="text-sm text-gray-500">Meeting link available</p>
                </div>
                {session.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={handleJoinMeeting}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Notes */}
          {session.notes && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 leading-relaxed">{session.notes}</p>
            </div>
          )}
          
          {/* Actions */}
          {isUpcoming && (
            <div className="flex space-x-3 pt-2">
              {!session.cal_com_booking_id && (
                <Button 
                  variant="outline" 
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-medium"
                  onClick={() => onReschedule(session.id)}
                >
                  Reschedule
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium px-8"
                onClick={() => onCancel(session.id)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{session.session_type}</h3>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(session.status)} font-medium border text-xs px-3 py-1`}>
              {session.status}
            </Badge>
            {session.cal_com_booking_id && (
              <Badge variant="outline" className="text-white border-white/50 bg-white/10 text-xs px-3 py-1">
                Cal.com
              </Badge>
            )}
          </div>
        </div>
        <p className="text-blue-100 text-sm">Professional coaching session</p>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Session Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{formatDate(session.session_date)}</p>
              <p className="text-sm text-gray-500">Session date</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{formatTime(session.session_date)}</p>
              <p className="text-sm text-gray-500">{session.duration} minutes</p>
            </div>
          </div>
          
          {session.preferred_coach && (
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{session.preferred_coach}</p>
                <p className="text-sm text-gray-500">Your coach</p>
              </div>
            </div>
          )}
          
          {session.meeting_link && isUpcoming && (
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="p-2 bg-green-50 rounded-lg">
                <Video className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-600">Video call ready</p>
                <p className="text-sm text-gray-500">Meeting link available</p>
              </div>
              {session.status === 'confirmed' && (
                <Button
                  size="sm"
                  onClick={handleJoinMeeting}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Notes */}
        {session.notes && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 leading-relaxed">{session.notes}</p>
          </div>
        )}
        
        {/* Actions */}
        {isUpcoming && (
          <div className="flex space-x-3 pt-2">
            {!session.cal_com_booking_id && (
              <Button 
                variant="outline" 
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-medium"
                onClick={() => onReschedule(session.id)}
              >
                Reschedule
              </Button>
            )}
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium px-8"
              onClick={() => onCancel(session.id)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;

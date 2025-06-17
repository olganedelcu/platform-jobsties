
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, MapPin } from 'lucide-react';
import { Session } from '@/types/sessions';

interface SessionCardProps {
  session: Session;
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
}

const SessionCard = ({ session, onReschedule, onCancel }: SessionCardProps) => {
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{session.session_type}</h3>
          <Badge className={`${getStatusColor(session.status)} font-medium border text-xs px-2 py-1`}>
            {session.status}
          </Badge>
        </div>
        <p className="text-blue-100 text-sm">Professional coaching session</p>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{formatDate(session.session_date)}</p>
              <p className="text-sm text-gray-500">Session date</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">{formatTime(session.session_date)}</p>
              <p className="text-sm text-gray-500">{session.duration} minutes</p>
            </div>
          </div>
          
          {session.preferred_coach && (
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">{session.preferred_coach}</p>
                <p className="text-sm text-gray-500">Your coach</p>
              </div>
            </div>
          )}
          
          {session.meeting_link && (
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="p-2 bg-green-50 rounded-lg">
                <Video className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-600">Video call ready</p>
                <p className="text-sm text-gray-500">Meeting link available</p>
              </div>
            </div>
          )}
        </div>
        
        {session.notes && (
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <p className="text-sm text-gray-600 leading-relaxed">{session.notes}</p>
          </div>
        )}
        
        <div className="flex space-x-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-medium py-2.5"
            onClick={() => onReschedule(session.id)}
          >
            Reschedule
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium py-2.5"
            onClick={() => onCancel(session.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;

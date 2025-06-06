
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Video } from 'lucide-react';

interface Session {
  id: string;
  session_type: string;
  session_date: string;
  duration: number;
  notes: string;
  preferred_coach: string;
  status: string;
  meeting_link: string;
}

interface SessionCardProps {
  session: Session;
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
}

const SessionCard = ({ session, onReschedule, onCancel }: SessionCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{session.session_type}</h3>
          <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            session.status === 'confirmed' 
              ? 'bg-green-100 text-green-800' 
              : session.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {session.status}
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(session.session_date)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{formatTime(session.session_date)} ({session.duration} min)</span>
        </div>
        {session.preferred_coach && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{session.preferred_coach}</span>
          </div>
        )}
        {session.meeting_link && (
          <div className="flex items-center space-x-2 text-sm text-indigo-600">
            <Video className="h-4 w-4" />
            <span>Video Call Ready</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 flex-1"
          onClick={() => onReschedule(session.id)}
        >
          Reschedule
        </Button>
        <Button 
          variant="outline" 
          className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
          onClick={() => onCancel(session.id)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SessionCard;

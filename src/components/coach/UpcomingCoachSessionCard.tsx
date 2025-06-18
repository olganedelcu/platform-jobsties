
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CoachSession {
  id: string;
  session_type: string;
  session_date: string;
  duration: number;
  notes: string;
  preferred_coach: string;
  status: string;
  meeting_link: string;
  coach_id: string;
  mentee_id: string;
  created_at: string;
  updated_at: string;
  mentee_name?: string;
  mentee_email?: string;
}

interface UpcomingCoachSessionCardProps {
  session: CoachSession;
  onConfirm: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
  onJoinMeeting: (meetingLink: string) => void;
}

const UpcomingCoachSessionCard = ({ 
  session, 
  onConfirm, 
  onCancel, 
  onJoinMeeting 
}: UpcomingCoachSessionCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (e) {
      return 'Invalid time';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isPending = session.status === 'pending';
  const isConfirmed = session.status === 'confirmed';

  return (
    <Card className={`border-l-4 ${isPending ? 'border-l-yellow-400' : isConfirmed ? 'border-l-green-400' : 'border-l-gray-400'}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{session.session_type}</CardTitle>
            <Badge className={`mt-1 ${getStatusColor(session.status)}`}>
              {session.status}
            </Badge>
          </div>
          <Badge variant="secondary">{session.duration} min</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(session.session_date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatTime(session.session_date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{session.mentee_name || 'Unknown Mentee'}</span>
          </div>
          {session.meeting_link && isConfirmed && (
            <div className="flex items-center space-x-2 text-sm text-indigo-600">
              <Video className="h-4 w-4" />
              <span>Video Call Ready</span>
            </div>
          )}
          {session.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              <p className="font-medium">Notes:</p>
              <p>{session.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 pt-2">
          {isPending && (
            <>
              <Button
                onClick={() => onConfirm(session.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={() => onCancel(session.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {isConfirmed && (
            <>
              {session.meeting_link && (
                <Button
                  onClick={() => onJoinMeeting(session.meeting_link)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => onCancel(session.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingCoachSessionCard;

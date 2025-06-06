
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
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

interface PendingSessionCardProps {
  session: CoachSession;
  onConfirm: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
}

const PendingSessionCard = ({ session, onConfirm, onCancel }: PendingSessionCardProps) => {
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

  return (
    <Card className="border-yellow-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{session.session_type}</CardTitle>
            <Badge variant="outline" className="mt-1 border-yellow-500 text-yellow-700">
              {session.status}
            </Badge>
          </div>
          <Badge variant="secondary">{session.session_type}</Badge>
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
            <span>{formatTime(session.session_date)} ({session.duration} min)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{session.mentee_name || 'Unknown'}</span>
          </div>
          {session.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              <p className="font-medium">Notes:</p>
              <p>{session.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingSessionCard;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Loader2 } from 'lucide-react';
import PendingSessionCard from './PendingSessionCard';
import ConfirmedSessionCard from './ConfirmedSessionCard';

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

interface SessionsListProps {
  sessions: CoachSession[];
  loading: boolean;
  onConfirmSession: (sessionId: string) => void;
  onCancelSession: (sessionId: string) => void;
  onJoinMeeting: (meetingLink: string) => void;
}

const SessionsList = ({ 
  sessions, 
  loading, 
  onConfirmSession, 
  onCancelSession, 
  onJoinMeeting 
}: SessionsListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
        <span>Loading sessions...</span>
      </div>
    );
  }

  const confirmedSessions = sessions.filter(session => session.status === 'confirmed');
  const pendingSessions = sessions.filter(session => session.status === 'pending');

  const EmptySessionsCard = ({ message }: { message: string }) => (
    <Card>
      <CardContent className="text-center py-8">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{message}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pending Sessions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Pending Sessions ({pendingSessions.length})
        </h2>
        <div className="space-y-4">
          {pendingSessions.length === 0 ? (
            <EmptySessionsCard message="No pending sessions" />
          ) : (
            pendingSessions.map((session) => (
              <PendingSessionCard
                key={session.id}
                session={session}
                onConfirm={onConfirmSession}
                onCancel={onCancelSession}
              />
            ))
          )}
        </div>
      </div>

      {/* Confirmed Sessions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Confirmed Sessions ({confirmedSessions.length})
        </h2>
        <div className="space-y-4">
          {confirmedSessions.length === 0 ? (
            <EmptySessionsCard message="No confirmed sessions" />
          ) : (
            confirmedSessions.map((session) => (
              <ConfirmedSessionCard
                key={session.id}
                session={session}
                onJoinMeeting={onJoinMeeting}
                onCancel={onCancelSession}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsList;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ScheduleSession from '@/components/ScheduleSession';
import UpcomingCoachSessionCard from './UpcomingCoachSessionCard';

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

interface CoachSessionsListProps {
  sessions: CoachSession[];
  loading: boolean;
  onConfirmSession: (sessionId: string) => void;
  onCancelSession: (sessionId: string) => void;
  onJoinMeeting: (meetingLink: string) => void;
}

const CoachSessionsList = ({ 
  sessions, 
  loading, 
  onConfirmSession, 
  onCancelSession, 
  onJoinMeeting 
}: CoachSessionsListProps) => {
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
        <span>Loading sessions...</span>
      </div>
    );
  }

  // Remove duplicates and filter for upcoming sessions
  const now = new Date();
  const uniqueSessions = sessions.filter((session, index, self) => 
    index === self.findIndex(s => s.id === session.id) &&
    new Date(session.session_date) >= now
  ).sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());

  const EmptySessionsCard = ({ message }: { message: string }) => (
    <Card>
      <CardContent className="text-center py-8">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{message}</p>
      </CardContent>
    </Card>
  );

  const handleScheduleSession = (sessionData: Record<string, unknown>) => {
    console.log('Coach scheduling session:', sessionData);
    setShowScheduleDialog(false);
    // The session will be automatically added via the Cal.com integration
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header with Schedule Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Upcoming Sessions ({uniqueSessions.length})
        </h2>
        
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-0">
            <ScheduleSession 
              onSchedule={handleScheduleSession}
              onCancel={() => setShowScheduleDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {uniqueSessions.length === 0 ? (
          <EmptySessionsCard message="No upcoming sessions scheduled" />
        ) : (
          uniqueSessions.map((session) => (
            <UpcomingCoachSessionCard
              key={session.id}
              session={session}
              onConfirm={onConfirmSession}
              onCancel={onCancelSession}
              onJoinMeeting={onJoinMeeting}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CoachSessionsList;

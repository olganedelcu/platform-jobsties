
import React from 'react';
import { Session } from '@/types/sessions';
import SessionCard from '@/components/SessionCard';
import { CalendarDays, Clock } from 'lucide-react';

interface UpcomingSessionsProps {
  sessions: Session[];
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => Promise<void>;
}

const UpcomingSessions = ({ sessions, onReschedule, onCancel }: UpcomingSessionsProps) => {
  const now = new Date();
  const upcomingSessions = sessions
    .filter(session => new Date(session.session_date) >= now)
    .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());

  const nextSession = upcomingSessions[0];
  const otherUpcoming = upcomingSessions.slice(1);

  if (upcomingSessions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-100">
        <CalendarDays className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
        <p className="text-gray-600">Schedule your next coaching session to continue your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Next Session Highlight */}
      {nextSession && (
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-200 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-blue-600">Next Session</h2>
          </div>
          <div className="bg-white rounded-xl">
            <SessionCard
              session={nextSession}
              onReschedule={onReschedule}
              onCancel={onCancel}
              isNextSession={true}
            />
          </div>
        </div>
      )}

      {/* Other Upcoming Sessions */}
      {otherUpcoming.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-blue-600" />
            Upcoming Sessions ({otherUpcoming.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {otherUpcoming.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onReschedule={onReschedule}
                onCancel={onCancel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;


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
  
  // Deduplicate sessions by ID and filter upcoming sessions
  const uniqueUpcomingSessions = sessions
    .filter((session, index, self) => 
      // Remove duplicates by ID
      index === self.findIndex(s => s.id === session.id)
    )
    .filter(session => new Date(session.session_date) >= now)
    .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());

  const nextSession = uniqueUpcomingSessions[0];
  const otherUpcoming = uniqueUpcomingSessions.slice(1);

  if (uniqueUpcomingSessions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-100">
        <CalendarDays className="h-12 w-12 text-blue-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
        <p className="text-gray-600 text-sm">Schedule your next coaching session to continue your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Next Session Highlight */}
      {nextSession && (
        <div className="bg-white rounded-2xl p-5 shadow-lg shadow-blue-200 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-blue-600">Next Session</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Upcoming Sessions ({otherUpcoming.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

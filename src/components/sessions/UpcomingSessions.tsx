
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
  
  // Enhanced deduplication: remove duplicates by multiple criteria
  const uniqueUpcomingSessions = sessions
    .filter(session => new Date(session.session_date) >= now)
    .filter((session, index, self) => {
      // Remove duplicates by ID
      const isFirstOccurrenceById = index === self.findIndex(s => s.id === session.id);
      
      // If session has cal_com_booking_id, check for duplicates by that field
      if (session.cal_com_booking_id) {
        const isFirstOccurrenceByBookingId = index === self.findIndex(s => 
          s.cal_com_booking_id === session.cal_com_booking_id
        );
        return isFirstOccurrenceById && isFirstOccurrenceByBookingId;
      }
      
      // For sessions without cal_com_booking_id, check for duplicates by date, type, and mentee
      const isFirstOccurrenceByDateTime = index === self.findIndex(s => 
        s.session_date === session.session_date && 
        s.session_type === session.session_type &&
        s.mentee_id === session.mentee_id &&
        Math.abs(new Date(s.session_date).getTime() - new Date(session.session_date).getTime()) < 60000 // Within 1 minute
      );
      
      return isFirstOccurrenceById && isFirstOccurrenceByDateTime;
    })
    .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());

  console.log('Unique upcoming sessions after deduplication:', uniqueUpcomingSessions);

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

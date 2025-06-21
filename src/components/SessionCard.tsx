
import React from 'react';
import { Session } from '@/types/sessions';
import SessionCardHeader from '@/components/sessions/SessionCardHeader';
import SessionCardDetails from '@/components/sessions/SessionCardDetails';
import SessionCardNotes from '@/components/sessions/SessionCardNotes';
import SessionCardActions from '@/components/sessions/SessionCardActions';

interface SessionCardProps {
  session: Session;
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
  isNextSession?: boolean;
}

const SessionCard = ({ session, onReschedule, onCancel, isNextSession = false }: SessionCardProps) => {
  const isUpcoming = new Date(session.session_date) >= new Date();

  if (isNextSession) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        <SessionCardHeader
          sessionType={session.session_type}
          status={session.status}
          calComBookingId={session.cal_com_booking_id}
          isNextSession={true}
          menteeFirstName={session.mentee?.first_name}
        />
        
        <div className="p-5 space-y-4">
          <SessionCardDetails
            sessionDate={session.session_date}
            duration={session.duration}
            preferredCoach={session.preferred_coach}
            meetingLink={session.meeting_link}
            status={session.status}
            isUpcoming={isUpcoming}
          />
          
          <SessionCardNotes notes={session.notes} />
          
          <SessionCardActions
            sessionId={session.id}
            isUpcoming={isUpcoming}
            calComBookingId={session.cal_com_booking_id}
            onReschedule={onReschedule}
            onCancel={onCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <SessionCardHeader
        sessionType={session.session_type}
        status={session.status}
        calComBookingId={session.cal_com_booking_id}
        menteeFirstName={session.mentee?.first_name}
      />
      
      <div className="p-4 space-y-4">
        <SessionCardDetails
          sessionDate={session.session_date}
          duration={session.duration}
          preferredCoach={session.preferred_coach}
          meetingLink={session.meeting_link}
          status={session.status}
          isUpcoming={isUpcoming}
        />
        
        <SessionCardNotes notes={session.notes} />
        
        <SessionCardActions
          sessionId={session.id}
          isUpcoming={isUpcoming}
          calComBookingId={session.cal_com_booking_id}
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default SessionCard;

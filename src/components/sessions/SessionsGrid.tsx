
import React from 'react';
import SessionCard from '@/components/SessionCard';
import { Session } from '@/types/sessions';

interface SessionsGridProps {
  sessions: Session[];
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => Promise<void>;
}

const SessionsGrid = ({ sessions, onReschedule, onCancel }: SessionsGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};

export default SessionsGrid;

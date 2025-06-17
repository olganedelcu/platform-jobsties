
import React, { useState } from 'react';
import { Session } from '@/types/sessions';
import SessionCard from '@/components/SessionCard';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PastSessionsProps {
  sessions: Session[];
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => Promise<void>;
}

const PastSessions = ({ sessions, onReschedule, onCancel }: PastSessionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const now = new Date();
  const pastSessions = sessions
    .filter(session => new Date(session.session_date) < now)
    .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());

  if (pastSessions.length === 0) {
    return null;
  }

  const displayedSessions = isExpanded ? pastSessions : pastSessions.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <History className="h-5 w-5 text-gray-600" />
          Past Sessions ({pastSessions.length})
        </h2>
        {pastSessions.length > 3 && (
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show All
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayedSessions.map((session) => (
          <div key={session.id} className="opacity-75 hover:opacity-100 transition-opacity">
            <SessionCard
              session={session}
              onReschedule={onReschedule}
              onCancel={onCancel}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastSessions;

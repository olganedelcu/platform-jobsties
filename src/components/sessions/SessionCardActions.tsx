
import React from 'react';
import { Button } from '@/components/ui/button';

interface SessionCardActionsProps {
  sessionId: string;
  isUpcoming: boolean;
  calComBookingId?: string;
  onReschedule: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
}

const SessionCardActions = ({
  sessionId,
  isUpcoming,
  calComBookingId,
  onReschedule,
  onCancel
}: SessionCardActionsProps) => {
  if (!isUpcoming) return null;

  return (
    <div className="flex space-x-2 pt-2">
      {!calComBookingId && (
        <Button 
          variant="outline" 
          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-medium text-sm"
          onClick={() => onReschedule(sessionId)}
        >
          Reschedule
        </Button>
      )}
      <Button 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium px-6 text-sm"
        onClick={() => onCancel(sessionId)}
      >
        Cancel
      </Button>
    </div>
  );
};

export default SessionCardActions;

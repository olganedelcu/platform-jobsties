
import React from 'react';

interface SessionCardNotesProps {
  notes?: string;
}

const SessionCardNotes = ({ notes }: SessionCardNotesProps) => {
  if (!notes) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-600 leading-relaxed">{notes}</p>
    </div>
  );
};

export default SessionCardNotes;

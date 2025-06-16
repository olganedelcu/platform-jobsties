
import React, { useState } from 'react';

interface TruncatedNotesProps {
  notes: string | null;
  maxLength?: number;
  className?: string;
}

const TruncatedNotes = ({ notes, maxLength = 150, className = "" }: TruncatedNotesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!notes) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  const shouldTruncate = notes.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? notes.substring(0, maxLength) + '...'
    : notes;

  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      <div className="bg-green-50 p-2 rounded border-l-2 border-green-400">
        <p className="whitespace-pre-wrap">{displayText}</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TruncatedNotes;

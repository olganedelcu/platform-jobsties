
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MenteeNameCellProps {
  menteeId: string;
  menteeName?: string;
}

const MenteeNameCell = ({ menteeId, menteeName }: MenteeNameCellProps) => {
  if (!menteeName) {
    return (
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback className="bg-gray-200 text-gray-600">
            ?
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-gray-900">Unknown Mentee</div>
          <div className="text-sm text-gray-500">{menteeId.slice(0, 8)}...</div>
        </div>
      </div>
    );
  }

  const nameParts = menteeName.split(' ');
  const initials = nameParts.length >= 2 
    ? `${nameParts[0][0]}${nameParts[1][0]}` 
    : nameParts[0][0] || '?';

  return (
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          {initials.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium text-gray-900">{menteeName}</div>
        <div className="text-sm text-gray-500">{menteeId.slice(0, 8)}...</div>
      </div>
    </div>
  );
};

export default MenteeNameCell;

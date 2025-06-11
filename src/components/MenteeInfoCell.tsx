
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mentee } from '@/hooks/useMentees';

interface MenteeInfoCellProps {
  mentee: Mentee;
}

const MenteeInfoCell = ({ mentee }: MenteeInfoCellProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          {mentee.first_name[0]}{mentee.last_name[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium text-gray-900">
          {mentee.first_name} {mentee.last_name}
        </div>
        <div className="text-sm text-gray-500">{mentee.email}</div>
      </div>
    </div>
  );
};

export default MenteeInfoCell;

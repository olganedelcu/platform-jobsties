
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Mentee } from '@/hooks/useMentees';

interface MenteeProgressItemProps {
  mentee: Mentee;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
}

const MenteeProgressItem = ({ mentee, overallProgress, completedModules, totalModules }: MenteeProgressItemProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs">
          {mentee.first_name[0]}{mentee.last_name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900 truncate">
            {mentee.first_name} {mentee.last_name}
          </p>
          <span className="text-xs text-gray-500">
            {overallProgress}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={overallProgress} className="h-1 flex-1" />
          <span className="text-xs text-gray-400">
            {completedModules}/{totalModules}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenteeProgressItem;

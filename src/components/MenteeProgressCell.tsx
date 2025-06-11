
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MenteeProgressCellProps {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
}

const MenteeProgressCell = ({ overallProgress, completedModules, totalModules }: MenteeProgressCellProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{overallProgress}%</span>
        <span className="text-xs text-gray-500">
          {completedModules}/{totalModules} modules
        </span>
      </div>
      <Progress value={overallProgress} className="h-2" />
    </div>
  );
};

export default MenteeProgressCell;

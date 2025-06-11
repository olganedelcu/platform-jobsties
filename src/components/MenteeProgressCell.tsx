
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

interface MenteeProgressCellProps {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  hasRealData?: boolean;
  emailConfirmed?: boolean;
}

const MenteeProgressCell = ({ 
  overallProgress, 
  completedModules, 
  totalModules, 
  hasRealData = false,
  emailConfirmed = false
}: MenteeProgressCellProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{overallProgress}%</span>
        <div className="flex items-center space-x-1">
          {!emailConfirmed && (
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
              <Mail className="h-3 w-3 mr-1" />
              Unconfirmed
            </Badge>
          )}
          {!hasRealData && emailConfirmed && (
            <Badge variant="outline" className="text-xs text-gray-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              No data
            </Badge>
          )}
          {hasRealData && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Progress 
          value={overallProgress} 
          className={`h-2 flex-1 mr-2 ${!hasRealData ? 'opacity-50' : ''}`} 
        />
        <span className="text-xs text-gray-500">
          {completedModules}/{totalModules} modules
        </span>
      </div>
    </div>
  );
};

export default MenteeProgressCell;

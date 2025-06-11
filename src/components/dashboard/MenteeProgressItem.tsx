
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mentee } from '@/hooks/useMentees';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

interface MenteeProgressItemProps {
  mentee: Mentee;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  hasRealData?: boolean;
  emailConfirmed?: boolean;
}

const MenteeProgressItem = ({ 
  mentee, 
  overallProgress, 
  completedModules, 
  totalModules, 
  hasRealData = false,
  emailConfirmed = false
}: MenteeProgressItemProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs">
          {mentee.first_name[0]}{mentee.last_name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {mentee.first_name} {mentee.last_name}
            </p>
            {!emailConfirmed && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                <Mail className="h-3 w-3 mr-1" />
                Unconfirmed
              </Badge>
            )}
            {!hasRealData && emailConfirmed && (
              <Badge variant="outline" className="text-xs text-gray-500">
                <AlertCircle className="h-3 w-3 mr-1" />
                No progress
              </Badge>
            )}
            {hasRealData && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {overallProgress}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Progress 
            value={overallProgress} 
            className={`h-1 flex-1 ${!hasRealData ? 'opacity-50' : ''}`} 
          />
          <span className="text-xs text-gray-400">
            {completedModules}/{totalModules}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenteeProgressItem;

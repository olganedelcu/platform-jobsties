
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Mail, BookOpen, Eye } from 'lucide-react';

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
  const getBadgeInfo = () => {
    if (!emailConfirmed) {
      return {
        icon: Mail,
        text: "Unconfirmed",
        variant: "outline" as const,
        className: "text-amber-600 border-amber-200"
      };
    }
    
    if (!hasRealData) {
      return {
        icon: Eye,
        text: "Demo progress",
        variant: "outline" as const,
        className: "text-blue-600 border-blue-200"
      };
    }
    
    return {
      icon: CheckCircle2,
      text: "Active",
      variant: "outline" as const,
      className: "text-green-600 border-green-200"
    };
  };

  const badgeInfo = getBadgeInfo();
  const IconComponent = badgeInfo.icon;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{overallProgress}%</span>
        <Badge variant={badgeInfo.variant} className={`text-xs ${badgeInfo.className}`}>
          <IconComponent className="h-3 w-3 mr-1" />
          {badgeInfo.text}
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <Progress 
          value={overallProgress} 
          className="h-2 flex-1 mr-2" 
        />
        <span className="text-xs text-gray-500">
          {completedModules}/{totalModules} modules
        </span>
      </div>
    </div>
  );
};

export default MenteeProgressCell;

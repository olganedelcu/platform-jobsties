
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CourseModuleIcon from './CourseModuleIcon';
import CourseModuleActions from './CourseModuleActions';

interface CourseModuleHeaderProps {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  completed: boolean;
  locked: boolean;
  expanded: boolean;
  moduleIndex: number;
  onToggle: () => void;
  onBookCall?: () => void;
  onMessageCoach: () => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

const CourseModuleHeader = ({
  title,
  description,
  icon,
  completed,
  locked,
  expanded,
  moduleIndex,
  onToggle,
  onBookCall,
  onMessageCoach,
  onComplete,
  onUncomplete
}: CourseModuleHeaderProps) => {
  return (
    <div 
      className="p-6 cursor-pointer"
      onClick={() => !locked && onToggle()}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <CourseModuleIcon 
            icon={icon}
            locked={locked}
            completed={completed}
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {completed && (
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  Completed
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!locked && (
            <>
              <CourseModuleActions
                moduleIndex={moduleIndex}
                moduleCompleted={completed}
                moduleLocked={locked}
                onBookCall={onBookCall}
                onMessageCoach={onMessageCoach}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
              />
              <div className="flex items-center">
                {expanded ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseModuleHeader;

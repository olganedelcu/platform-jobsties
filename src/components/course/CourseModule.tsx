
import React from 'react';
import CourseModuleHeader from './CourseModuleHeader';
import CourseModuleContent from './CourseModuleContent';

export interface CourseModuleData {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  completed: boolean;
  locked: boolean;
  action: string | null;
}

interface CourseModuleProps {
  module: CourseModuleData;
  index: number;
  expanded: boolean;
  userId: string;
  onToggle: () => void;
  onComplete: () => void;
  onUncomplete: () => void;
  onBookCall?: () => void;
  onMessageCoach?: () => void;
}

const CourseModule = ({ 
  module, 
  index, 
  expanded, 
  userId, 
  onToggle, 
  onComplete, 
  onUncomplete, 
  onBookCall,
  onMessageCoach 
}: CourseModuleProps) => {
  const handleMessageCoach = () => {
    if (onMessageCoach) {
      onMessageCoach();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${module.locked ? 'opacity-60' : ''}`}>
      <CourseModuleHeader
        title={module.title}
        description={module.description}
        icon={module.icon}
        completed={module.completed}
        locked={module.locked}
        expanded={expanded}
        moduleIndex={index}
        onToggle={onToggle}
        onBookCall={onBookCall}
        onMessageCoach={handleMessageCoach}
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
      
      {expanded && !module.locked && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <CourseModuleContent 
            moduleIndex={index} 
            userId={userId}
            moduleAction={module.action} 
            onBookCall={onBookCall}
            onComplete={onComplete}
            onUncomplete={onUncomplete}
            isCompleted={module.completed}
          />
        </div>
      )}
      
      {module.locked && (
        <div className="px-6 pb-6">
          <div className="text-sm text-gray-500">
            Complete previous modules to unlock
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseModule;


import React from 'react';
import { ChevronDown, ChevronUp, Lock, CheckCircle, RotateCcw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const Icon = module.icon;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (module.action === 'Book Call' && onBookCall) {
      onBookCall();
    } else if (!module.completed) {
      onComplete();
    }
  };

  const handleUncompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUncomplete();
  };

  const handleMessageCoachClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMessageCoach) {
      onMessageCoach();
    }
  };

  const getActionText = () => {
    if (module.action === 'Book Call') return 'Book Call';
    if (module.completed) return 'Completed';
    return 'Complete';
  };

  // Don't show the action button for Interview Preparation module (index 3)
  const shouldShowActionButton = index !== 3;

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${module.locked ? 'opacity-60' : ''}`}>
      <div 
        className="p-6 cursor-pointer"
        onClick={() => !module.locked && onToggle()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              module.locked 
                ? 'bg-gray-100' 
                : module.completed 
                ? 'bg-green-100' 
                : 'bg-gradient-to-r from-blue-100 to-blue-200'
            }`}>
              {module.locked ? (
                <Lock className="h-6 w-6 text-gray-400" />
              ) : module.completed ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Icon className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                {module.completed && (
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{module.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!module.locked && (
              <>
                <Button
                  onClick={handleMessageCoachClick}
                  variant="outline"
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 px-4 py-2 text-sm flex items-center space-x-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Message Coach</span>
                </Button>
                {shouldShowActionButton && (
                  <Button
                    onClick={handleActionClick}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 text-sm"
                  >
                    {getActionText()}
                  </Button>
                )}
                {module.completed && (
                  <Button
                    onClick={handleUncompleteClick}
                    variant="outline"
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Uncomplete</span>
                  </Button>
                )}
              </>
            )}
            {!module.locked && (
              <div className="flex items-center">
                {expanded ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </div>
            )}
          </div>
        </div>
      </div>
      
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

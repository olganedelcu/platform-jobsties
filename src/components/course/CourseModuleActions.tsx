
import React from 'react';
import { MessageCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseModuleActionsProps {
  moduleIndex: number;
  moduleCompleted: boolean;
  moduleLocked: boolean;
  onBookCall?: () => void;
  onMessageCoach: () => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

const CourseModuleActions = ({
  moduleIndex,
  moduleCompleted,
  moduleLocked,
  onBookCall,
  onMessageCoach,
  onComplete,
  onUncomplete
}: CourseModuleActionsProps) => {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (moduleIndex === 3) { // Interview Preparation module
      if (onBookCall) {
        onBookCall();
      }
    } else if (!moduleCompleted) {
      onComplete();
    }
  };

  const handleUncompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUncomplete();
  };

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete();
  };

  const handleMessageCoachClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMessageCoach();
  };

  const getActionText = () => {
    if (moduleIndex === 3) return 'Schedule Session'; // Interview Preparation module
    if (moduleCompleted) return 'Completed';
    return 'Complete';
  };

  if (moduleLocked) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleMessageCoachClick}
        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"
        title="Message Coach"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
      
      <Button
        onClick={handleActionClick}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 text-sm"
      >
        {getActionText()}
      </Button>
      
      {/* Show separate Complete/Uncomplete buttons for Interview Preparation module */}
      {moduleIndex === 3 && (
        <>
          {!moduleCompleted ? (
            <Button
              onClick={handleCompleteClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 text-sm"
            >
              Complete
            </Button>
          ) : (
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
      
      {/* Show Uncomplete button for other completed modules */}
      {moduleCompleted && moduleIndex !== 3 && (
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
  );
};

export default CourseModuleActions;


import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, RotateCcw } from 'lucide-react';
import ModuleFiles from '@/components/ModuleFiles';

interface InterviewPreparationModuleProps {
  userId: string;
  moduleAction?: string | null;
  onBookCall?: () => void;
  onComplete?: () => void;
  onUncomplete?: () => void;
  isCompleted?: boolean;
}

const InterviewPreparationModule = ({ 
  userId, 
  moduleAction, 
  onBookCall, 
  onComplete, 
  onUncomplete, 
  isCompleted 
}: InterviewPreparationModuleProps) => {
  return (
    <div className="space-y-6">
      <ModuleFiles 
        userId={userId} 
        moduleType="interview_preparation" 
        title="Interview Preparation" 
      />
      <div className="flex flex-wrap gap-3">
        {!isCompleted ? (
          <Button 
            onClick={onComplete}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Complete</span>
          </Button>
        ) : (
          <Button 
            onClick={onUncomplete}
            variant="outline"
            className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Uncomplete</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewPreparationModule;

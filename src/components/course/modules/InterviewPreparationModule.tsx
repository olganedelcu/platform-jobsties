
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, RotateCcw } from 'lucide-react';
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
      <p className="text-gray-700">
        Prepare for interviews with comprehensive guidance on common questions, body language, 
        and how to showcase your skills effectively.
      </p>
      <ModuleFiles 
        userId={userId} 
        moduleType="interview_preparation" 
        title="Interview Preparation" 
      />
      <div className="flex flex-wrap gap-3">
        {moduleAction === 'Book Call' && onBookCall && (
          <Button 
            onClick={onBookCall}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Interview Preparation Call</span>
          </Button>
        )}
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

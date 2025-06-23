
import React from 'react';
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
    </div>
  );
};

export default InterviewPreparationModule;

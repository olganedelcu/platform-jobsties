
import React from 'react';
import CVOptimizationModule from './modules/CVOptimizationModule';
import GenericModuleWithFiles from './modules/GenericModuleWithFiles';
import InterviewPreparationModule from './modules/InterviewPreparationModule';
import FeedbackModule from './modules/FeedbackModule';

interface CourseModuleContentProps {
  moduleIndex: number;
  userId: string;
  moduleAction?: string | null;
  onBookCall?: () => void;
  onComplete?: () => void;
  onUncomplete?: () => void;
  isCompleted?: boolean;
}

const CourseModuleContent = ({ 
  moduleIndex, 
  userId, 
  moduleAction, 
  onBookCall, 
  onComplete, 
  onUncomplete, 
  isCompleted 
}: CourseModuleContentProps) => {
  switch (moduleIndex) {
    case 0:
      return (
        <CVOptimizationModule 
          userId={userId} 
          moduleAction={moduleAction} 
        />
      );
    case 1:
      return (
        <GenericModuleWithFiles
          userId={userId}
          moduleType="linkedin"
          title="LinkedIn & Cover Letter"
          description="This module will help you optimize your LinkedIn profile and create compelling cover letters. Your coach may upload resources and templates to help you succeed."
        />
      );
    case 2:
      return (
        <GenericModuleWithFiles
          userId={userId}
          moduleType="job_search_strategy"
          title="Job Search Strategy"
          description="Learn effective job search strategies, including where to find opportunities, how to network, and how to tailor your applications for maximum impact."
        />
      );
    case 3:
      return (
        <InterviewPreparationModule
          userId={userId}
          moduleAction={moduleAction}
          onBookCall={onBookCall}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          isCompleted={isCompleted}
        />
      );
    case 4:
      return (
        <FeedbackModule userId={userId} />
      );
    default:
      return null;
  }
};

export default CourseModuleContent;

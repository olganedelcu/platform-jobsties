
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import MenteeCVFiles from '@/components/MenteeCVFiles';

interface CourseModuleContentProps {
  moduleIndex: number;
  userId: string;
  moduleAction?: string | null;
  onBookCall?: () => void;
}

const CourseModuleContent = ({ moduleIndex, userId, moduleAction, onBookCall }: CourseModuleContentProps) => {
  switch (moduleIndex) {
    case 0:
      return (
        <div className="space-y-4">
          <p className="text-gray-700">
            Your coach can upload CV files for you to review and download. These files will be available here once uploaded.
          </p>
          <MenteeCVFiles userId={userId} />
          {moduleAction && (
            <Button 
              className="mt-4 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {moduleAction}
            </Button>
          )}
        </div>
      );
    case 1:
      return (
        <div>
          <p className="text-gray-700">
            This module will help you optimize your LinkedIn profile and create compelling cover letters. 
            Content will be available soon.
          </p>
        </div>
      );
    case 2:
      return (
        <div>
          <p className="text-gray-700">
            Learn effective job search strategies, including where to find opportunities, how to network, 
            and how to tailor your applications for maximum impact.
          </p>
        </div>
      );
    case 3:
      return (
        <div className="space-y-4">
          <p className="text-gray-700">
            Prepare for interviews with comprehensive guidance on common questions, body language, 
            and how to showcase your skills effectively.
          </p>
          {moduleAction === 'Book Call' && onBookCall && (
            <Button 
              onClick={onBookCall}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Interview Preparation Call</span>
            </Button>
          )}
        </div>
      );
    case 4:
      return (
        <div>
          <p className="text-gray-700">
            Review your progress throughout the course and plan your next steps for continued career development.
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default CourseModuleContent;

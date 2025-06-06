
import React from 'react';
import { Button } from '@/components/ui/button';
import MenteeCVFiles from '@/components/MenteeCVFiles';

interface CourseModuleContentProps {
  moduleIndex: number;
  userId: string;
  moduleAction?: string | null;
}

const CourseModuleContent = ({ moduleIndex, userId, moduleAction }: CourseModuleContentProps) => {
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
    default:
      return null;
  }
};

export default CourseModuleContent;

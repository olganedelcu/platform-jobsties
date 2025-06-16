
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CourseHeaderProps {
  progress?: number;
}

const CourseHeader = ({ progress = 0 }: CourseHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Career Files</h1>
      
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <Progress value={progress} className="flex-1" />
          <span className="text-sm text-gray-600 font-medium">{Math.round(progress)}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;

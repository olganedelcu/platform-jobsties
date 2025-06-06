
import React from 'react';

interface CourseHeaderProps {
  progress?: number;
}

const CourseHeader = ({ progress = 0 }: CourseHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Career Development Course</h1>
      <p className="text-gray-600 mt-2">Your personalized journey to career success</p>
      
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">{progress}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;


import React from 'react';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';

interface DashboardHeaderProps {
  user: any;
  firstName: string;
}

const DashboardHeader = ({ user, firstName }: DashboardHeaderProps) => {
  const { greeting } = useTimeBasedGreeting(firstName);

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {firstName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {greeting}
            </h1>
            <p className="text-gray-600 text-lg">Ready to accelerate your career journey?</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">{firstName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

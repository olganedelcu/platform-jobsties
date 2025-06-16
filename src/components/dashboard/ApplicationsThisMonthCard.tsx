
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationsThisMonthCardProps {
  applications: JobApplication[];
  loading?: boolean;
  onClick?: () => void;
}

const ApplicationsThisMonthCard = ({ applications, loading, onClick }: ApplicationsThisMonthCardProps) => {
  // Calculate applications for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  
  const applicationsToday = applications.filter(app => {
    const appDate = new Date(app.date_applied);
    return appDate >= today && appDate <= endOfToday;
  }).length;

  const dailyTarget = 5; // Adjusted for daily target
  const progressPercentage = Math.min((applicationsToday / dailyTarget) * 100, 100);

  if (loading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-center gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1.5 h-8 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" 
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{applicationsToday}</div>
          <div className="text-sm text-gray-600 mb-2">Applications today</div>
          <div className="text-xs text-gray-500 mb-4">Target: {dailyTarget} per day</div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Visualization bars */}
          <div className="flex justify-center gap-1">
            {[...Array(Math.min(applicationsToday, 12))].map((_, i) => (
              <div key={i} className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsThisMonthCard;

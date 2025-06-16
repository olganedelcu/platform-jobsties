
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationsThisMonthCardProps {
  applications: JobApplication[];
  loading?: boolean;
  onClick?: () => void;
}

const ApplicationsThisMonthCard = ({ applications, loading, onClick }: ApplicationsThisMonthCardProps) => {
  // Calculate applications for this specific week (16th to 22nd)
  const weekStart = new Date(2025, 5, 16); // June 16th, 2025 (month is 0-indexed)
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(2025, 5, 22); // June 22nd, 2025
  weekEnd.setHours(23, 59, 59, 999);
  
  const applicationsThisWeek = applications.filter(app => {
    const appDate = new Date(app.date_applied);
    return appDate >= weekStart && appDate <= weekEnd;
  }).length;

  const weeklyTarget = 20;
  const progressPercentage = Math.min((applicationsThisWeek / weeklyTarget) * 100, 100);

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
          <div className="text-4xl font-bold text-blue-600 mb-2">{applicationsThisWeek}</div>
          <div className="text-sm text-gray-600 mb-2">Applications this week</div>
          <div className="text-xs text-gray-500 mb-4">Target: {weeklyTarget} per week (16th-22nd)</div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Visualization bars */}
          <div className="flex justify-center gap-1">
            {[...Array(Math.min(applicationsThisWeek, 12))].map((_, i) => (
              <div key={i} className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsThisMonthCard;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationsThisMonthCardProps {
  applications: JobApplication[];
  loading?: boolean;
  onClick?: () => void;
}

const ApplicationsThisMonthCard = ({ applications, loading, onClick }: ApplicationsThisMonthCardProps) => {
  // Calculate current week period dynamically
  const getCurrentWeekPeriod = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let weekStart: Date;
    let weekEnd: Date;
    let weekLabel: string;
    
    if (currentDay >= 16 && currentDay <= 22) {
      // 16th to 22nd
      weekStart = new Date(currentYear, currentMonth, 16);
      weekEnd = new Date(currentYear, currentMonth, 22);
      weekLabel = "16th-22nd";
    } else if (currentDay >= 23 && currentDay <= 29) {
      // 23rd to 29th
      weekStart = new Date(currentYear, currentMonth, 23);
      weekEnd = new Date(currentYear, currentMonth, 29);
      weekLabel = "23rd-29th";
    } else if (currentDay >= 30 || currentDay <= 6) {
      // 30th to 6th (crosses month boundary)
      if (currentDay >= 30) {
        weekStart = new Date(currentYear, currentMonth, 30);
        weekEnd = new Date(currentYear, currentMonth + 1, 6);
        weekLabel = "30th-6th";
      } else {
        // We're in the first 6 days, so the week started last month
        weekStart = new Date(currentYear, currentMonth - 1, 30);
        weekEnd = new Date(currentYear, currentMonth, 6);
        weekLabel = "30th-6th";
      }
    } else if (currentDay >= 7 && currentDay <= 13) {
      // 7th to 13th
      weekStart = new Date(currentYear, currentMonth, 7);
      weekEnd = new Date(currentYear, currentMonth, 13);
      weekLabel = "7th-13th";
    } else {
      // 14th to 15th (partial week)
      weekStart = new Date(currentYear, currentMonth, 14);
      weekEnd = new Date(currentYear, currentMonth, 15);
      weekLabel = "14th-15th";
    }
    
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { weekStart, weekEnd, weekLabel };
  };

  const { weekStart, weekEnd, weekLabel } = getCurrentWeekPeriod();
  
  const applicationsThisWeek = applications.filter(app => {
    const appDate = new Date(app.date_applied);
    return appDate >= weekStart && appDate <= weekEnd;
  }).length;

  const weeklyTarget = 30;
  const progressPercentage = Math.min((applicationsThisWeek / weeklyTarget) * 100, 100);

  if (loading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
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
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {applicationsThisWeek}/30
          </div>
          <div className="text-sm text-gray-600 mb-4">Applications this week</div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsThisMonthCard;

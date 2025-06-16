
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationsThisMonthCardProps {
  applications: JobApplication[];
  loading?: boolean;
  onClick?: () => void;
}

const ApplicationsThisMonthCard = ({ applications, loading, onClick }: ApplicationsThisMonthCardProps) => {
  // Calculate applications for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const applicationsThisMonth = applications.filter(app => {
    const appDate = new Date(app.date_applied);
    return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
  }).length;

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
          <div className="text-4xl font-bold text-blue-600 mb-2">{applicationsThisMonth}</div>
          <div className="text-sm text-gray-600 mb-4">Applications this month</div>
          <div className="flex justify-center gap-1">
            {[...Array(Math.min(applicationsThisMonth, 12))].map((_, i) => (
              <div key={i} className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsThisMonthCard;

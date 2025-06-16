
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CareerProgressCard from '@/components/dashboard/CareerProgressCard';
import TasksInProgressCard from '@/components/dashboard/TasksInProgressCard';
import DashboardTaskBoard from '@/components/dashboard/DashboardTaskBoard';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardContentProps {
  user: any;
}

const DashboardContent = ({ user }: DashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || user?.first_name || 'there';
  
  const { upcomingSessions, profileCompletion, courseProgress, loading } = useDashboardData(user?.id);
  const { todaysQuote } = useQuoteOfTheDay();

  const handleCVOptimizedClick = () => {
    navigate('/course?module=cv-optimization');
  };

  const handleInterviewPrepClick = () => {
    navigate('/course?module=interview-preparation');
  };

  const handleSalaryNegotiationClick = () => {
    navigate('/course?module=salary-negotiation');
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 bg-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 bg-white">
      <DashboardHeader user={user} firstName={firstName} />

      {/* Quote of the day */}
      {todaysQuote && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <blockquote className="text-lg font-medium text-gray-900 italic mb-2">
              "{todaysQuote.text}"
            </blockquote>
            <cite className="text-sm text-blue-600 font-semibold">— {todaysQuote.author}</cite>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Career Progress Card */}
        <CareerProgressCard
          courseProgress={courseProgress}
          onCVOptimizedClick={handleCVOptimizedClick}
          onInterviewPrepClick={handleInterviewPrepClick}
          onSalaryNegotiationClick={handleSalaryNegotiationClick}
        />

        {/* Tasks In Progress */}
        <TasksInProgressCard userId={user?.id} />

        {/* Task Board */}
        <div className="xl:col-span-1">
          <DashboardTaskBoard userId={user?.id} />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;

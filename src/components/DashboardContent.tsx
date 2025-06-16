
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CareerProgressCard from '@/components/dashboard/CareerProgressCard';
import TasksInProgressCard from '@/components/dashboard/TasksInProgressCard';
import DashboardTaskBoard from '@/components/dashboard/DashboardTaskBoard';
import MenteeRecentActivityCard from '@/components/dashboard/MenteeRecentActivityCard';
import DashboardQuickLinks from '@/components/DashboardQuickLinks';

interface DashboardContentProps {
  user: any;
}

const DashboardContent = ({ user }: DashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || user?.first_name || 'there';
  
  const { upcomingSessions, profileCompletion, courseProgress, loading } = useDashboardData(user?.id);

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

        {/* Recent Activity */}
        <MenteeRecentActivityCard
          user={user}
          onViewAll={() => navigate('/tracker')}
          onAddApplication={() => navigate('/tracker')}
        />

        {/* Task Board */}
        <div className="xl:col-span-1">
          <DashboardTaskBoard userId={user?.id} />
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <DashboardQuickLinks />
      </div>
    </main>
  );
};

export default DashboardContent;

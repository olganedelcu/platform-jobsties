
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CareerProgressCard from '@/components/dashboard/CareerProgressCard';
import DashboardTaskBoard from '@/components/dashboard/DashboardTaskBoard';
import MenteeRecentActivityCard from '@/components/dashboard/MenteeRecentActivityCard';
import ApplicationsThisMonthCard from '@/components/dashboard/ApplicationsThisMonthCard';
import DashboardQuickLinks from '@/components/DashboardQuickLinks';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

interface DashboardContentProps {
  user: any;
}

const DashboardContent = ({ user }: DashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || user?.first_name || 'there';
  
  const { upcomingSessions, profileCompletion, courseProgress, loading } = useDashboardData(user?.id);
  const { applications, loading: applicationsLoading } = useJobApplicationsData(user);

  const handleCVOptimizedClick = () => {
    navigate('/course?module=cv-optimization');
  };

  const handleInterviewPrepClick = () => {
    navigate('/course?module=interview-preparation');
  };

  const handleSalaryNegotiationClick = () => {
    navigate('/course?module=salary-negotiation');
  };

  if (loading || applicationsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="max-w-7xl mx-auto pt-8 py-8 px-4 sm:px-6 bg-white">
      <DashboardHeader user={user} firstName={firstName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Career Progress Card */}
        <CareerProgressCard
          courseProgress={courseProgress}
          onCVOptimizedClick={handleCVOptimizedClick}
          onInterviewPrepClick={handleInterviewPrepClick}
          onSalaryNegotiationClick={handleSalaryNegotiationClick}
        />

        {/* Applications This Month */}
        <ApplicationsThisMonthCard
          applications={applications}
          loading={applicationsLoading}
          onClick={() => navigate('/tracker')}
        />

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


import React, { memo, useMemo } from 'react';
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

const DashboardContent = memo(({ user }: DashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = useMemo(() => 
    user?.user_metadata?.first_name || user?.first_name || 'there',
    [user]
  );
  
  const { upcomingSessions, profileCompletion, courseProgress, loading } = useDashboardData(user?.id);
  const { applications, loading: applicationsLoading } = useJobApplicationsData(user);

  // Calculate applications for this specific week (16th to 22nd) for header
  const weekStart = new Date(2025, 5, 16); // June 16th, 2025 (month is 0-indexed)
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(2025, 5, 22); // June 22nd, 2025
  weekEnd.setHours(23, 59, 59, 999);
  
  const applicationsThisWeek = applications.filter(app => {
    const appDate = new Date(app.date_applied);
    return appDate >= weekStart && appDate <= weekEnd;
  }).length;

  const navigationHandlers = useMemo(() => ({
    handleCVOptimizedClick: () => navigate('/course?module=cv-optimization'),
    handleInterviewPrepClick: () => navigate('/course?module=interview-preparation'),
    handleSalaryNegotiationClick: () => navigate('/course?module=salary-negotiation'),
    handleTrackerClick: () => navigate('/tracker'),
    handleAddApplicationClick: () => navigate('/tracker')
  }), [navigate]);

  if (loading || applicationsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="max-w-7xl mx-auto pt-8 py-8 px-4 sm:px-6 bg-white">
      <DashboardHeader 
        user={user} 
        firstName={firstName} 
        applicationsThisMonth={applicationsThisWeek}
        onTrackerClick={navigationHandlers.handleTrackerClick}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Career Progress Card */}
        <CareerProgressCard
          courseProgress={courseProgress}
          onCVOptimizedClick={navigationHandlers.handleCVOptimizedClick}
          onInterviewPrepClick={navigationHandlers.handleInterviewPrepClick}
          onSalaryNegotiationClick={navigationHandlers.handleSalaryNegotiationClick}
        />

        {/* Applications This Week */}
        <ApplicationsThisMonthCard
          applications={applications}
          loading={applicationsLoading}
          onClick={navigationHandlers.handleTrackerClick}
        />

        {/* Recent Activity */}
        <MenteeRecentActivityCard
          user={user}
          onViewAll={navigationHandlers.handleTrackerClick}
          onAddApplication={navigationHandlers.handleAddApplicationClick}
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
});

DashboardContent.displayName = 'DashboardContent';

export default DashboardContent;

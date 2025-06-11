
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import DashboardQuickLinks from '@/components/DashboardQuickLinks';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CareerProgressCard from '@/components/dashboard/CareerProgressCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import UpcomingSessionsCard from '@/components/dashboard/UpcomingSessionsCard';
import ApplicationsStatsCard from '@/components/dashboard/ApplicationsStatsCard';

interface DashboardContentProps {
  user: any;
}

const DashboardContent = ({ user }: DashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || 'User';
  const { courseProgress } = useDashboardData(user?.id || '');
  const { applications } = useJobApplicationsData(user);
  
  // Calculate applications this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const applicationsThisMonth = applications.filter(app => 
    new Date(app.date_applied) >= firstDayOfMonth
  ).length;

  // Get recent activity (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentApplications = applications
    .filter(app => new Date(app.date_applied) >= oneWeekAgo)
    .sort((a, b) => new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime())
    .slice(0, 3);

  const handleCVOptimizedClick = () => {
    navigate('/course');
  };

  const handleInterviewPrepClick = () => {
    navigate('/course');
  };

  const handleSalaryNegotiationClick = () => {
    navigate('/course');
  };
  
  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <DashboardHeader user={user} firstName={firstName} />

      <DashboardQuickLinks />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <CareerProgressCard
            courseProgress={courseProgress}
            onCVOptimizedClick={handleCVOptimizedClick}
            onInterviewPrepClick={handleInterviewPrepClick}
            onSalaryNegotiationClick={handleSalaryNegotiationClick}
          />

          <RecentActivityCard
            recentApplications={recentApplications}
            onViewAll={() => navigate('/tracker')}
            onAddApplication={() => navigate('/tracker')}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <UpcomingSessionsCard />

          <ApplicationsStatsCard
            applicationsThisMonth={applicationsThisMonth}
            onClick={() => navigate('/tracker')}
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import DashboardQuickLinks from '@/components/DashboardQuickLinks';
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
      {/* Simplified Header without avatar */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Good morning, {firstName}
        </h1>
        <p className="text-gray-500 text-lg">Ready to accelerate your career journey?</p>
      </div>

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

          {/* Profile Section */}
          <div className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={firstName} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <DashboardQuickLinks />
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

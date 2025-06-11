
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { courseModules } from '@/data/courseModules';
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
  const { applications } = useJobApplicationsData(user);
  const { progress } = useCourseProgress({ id: user?.id || '' });
  
  // Calculate course progress based on completed modules (same as course page)
  const calculateCourseProgress = () => {
    const completedModules = progress.filter(p => p.completed).length;
    return Math.min((completedModules / courseModules.length) * 100, 100);
  };

  const courseProgress = calculateCourseProgress();
  
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
      {/* Header with avatar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good morning, {firstName}
            </h1>
            <p className="text-gray-500 text-lg">Ready to accelerate your career journey?</p>
          </div>
        </div>
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
      
      <div className="mt-8">
        <DashboardQuickLinks />
      </div>
    </main>
  );
};

export default DashboardContent;

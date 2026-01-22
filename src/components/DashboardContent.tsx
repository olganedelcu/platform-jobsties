
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
// replaced CareerProgressCard with ApplicationsThisMonthCard to show weekly bars
import DashboardTaskBoard from '@/components/dashboard/DashboardTaskBoard';
import CareerProgressCard from '@/components/dashboard/CareerProgressCard';
import MenteeRecentActivityCard from '@/components/dashboard/MenteeRecentActivityCard';
import ApplicationsThisMonthCard from '@/components/dashboard/ApplicationsThisMonthCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

interface DashboardContentProps {
  user: User | null;
}

const DashboardContent = memo(({ user }: DashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = useMemo(() =>
    user?.user_metadata?.first_name || 'there',
    [user]
  );
  
  const { upcomingSessions, profileCompletion, courseProgress, loading } = useDashboardData(user?.id);
  const { applications, loading: applicationsLoading } = useJobApplicationsData(user);

  // Calculate current week period dynamically for header
  const getCurrentWeekPeriod = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let weekStart: Date;
    let weekEnd: Date;
    
    if (currentDay >= 16 && currentDay <= 22) {
      weekStart = new Date(currentYear, currentMonth, 16);
      weekEnd = new Date(currentYear, currentMonth, 22);
    } else if (currentDay >= 23 && currentDay <= 29) {
      weekStart = new Date(currentYear, currentMonth, 23);
      weekEnd = new Date(currentYear, currentMonth, 29);
    } else if (currentDay >= 30 || currentDay <= 6) {
      if (currentDay >= 30) {
        weekStart = new Date(currentYear, currentMonth, 30);
        weekEnd = new Date(currentYear, currentMonth + 1, 6);
      } else {
        weekStart = new Date(currentYear, currentMonth - 1, 30);
        weekEnd = new Date(currentYear, currentMonth, 6);
      }
    } else if (currentDay >= 7 && currentDay <= 13) {
      weekStart = new Date(currentYear, currentMonth, 7);
      weekEnd = new Date(currentYear, currentMonth, 13);
    } else {
      weekStart = new Date(currentYear, currentMonth, 14);
      weekEnd = new Date(currentYear, currentMonth, 15);
    }
    
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { weekStart, weekEnd };
  };

  const { weekStart, weekEnd } = getCurrentWeekPeriod();
  
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
      {/* Header section with greeting and applications card */}
      <div className="flex items-start justify-between mb-8">
        <DashboardHeader 
          user={user} 
          firstName={firstName} 
          applicationsThisMonth={applicationsThisWeek}
          onTrackerClick={navigationHandlers.handleTrackerClick}
        />
        
        {/* Applications This Week Card - positioned in header area */}
        <div className="flex-shrink-0 ml-8">
          <ApplicationsThisMonthCard
            applications={applications}
            loading={applicationsLoading}
            onClick={navigationHandlers.handleTrackerClick}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Career Progress (now includes weekly applications chart) */}
        <CareerProgressCard
          courseProgress={courseProgress}
          applications={applications}
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
    </main>
  );
});

DashboardContent.displayName = 'DashboardContent';

export default DashboardContent;

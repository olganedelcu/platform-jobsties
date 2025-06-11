
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMentees } from '@/hooks/useMentees';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useCoachSessions } from '@/hooks/useCoachSessions';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MenteesCard from '@/components/dashboard/MenteesCard';
import ApplicationsStatsCard from '@/components/dashboard/ApplicationsStatsCard';
import UpcomingSessionsCard from '@/components/dashboard/UpcomingSessionsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import DashboardQuickLinks from '@/components/DashboardQuickLinks';

interface CoachDashboardContentProps {
  user: any;
}

const CoachDashboardContent = ({ user }: CoachDashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || user?.first_name || 'Coach';
  
  const { mentees, loading: menteesLoading } = useMentees();
  const { applications, loading: applicationsLoading } = useCoachApplications();
  const { sessions, loading: sessionsLoading } = useCoachSessions(user?.id);

  // Calculate applications stats
  const totalApplications = applications.length;
  const recentApplications = applications.filter(app => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(app.date_applied) >= oneWeekAgo;
  });

  // Sort recent applications by date (most recent first) - show all of them
  const sortedRecentApplications = recentApplications.sort((a, b) => 
    new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime()
  );

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <DashboardHeader user={user} firstName={firstName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Mentees Card */}
        <MenteesCard
          mentees={mentees}
          loading={menteesLoading}
          onViewAll={() => navigate('/coach/mentees')}
        />

        {/* Applications Stats */}
        <ApplicationsStatsCard
          applicationsThisMonth={totalApplications}
          onClick={() => navigate('/coach/applications')}
        />

        {/* Recent Activity - Now shows all recent applications */}
        <RecentActivityCard
          recentApplications={sortedRecentApplications}
          onViewAll={() => navigate('/coach/applications')}
          onAddApplication={() => navigate('/coach/applications')}
        />

        {/* Upcoming Sessions */}
        <UpcomingSessionsCard />
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Mentees</h3>
          <p className="text-3xl font-bold text-indigo-600">{mentees.length}</p>
          <p className="text-sm text-gray-500 mt-1">Currently assigned</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Applications Tracked</h3>
          <p className="text-3xl font-bold text-green-600">{totalApplications}</p>
          <p className="text-sm text-gray-500 mt-1">Across all mentees</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
          <p className="text-3xl font-bold text-purple-600">{recentApplications.length}</p>
          <p className="text-sm text-gray-500 mt-1">Applications this week</p>
        </div>
      </div>

      <div className="mt-8">
        <DashboardQuickLinks />
      </div>
    </main>
  );
};

export default CoachDashboardContent;

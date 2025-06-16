
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMentees } from '@/hooks/useMentees';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useCoachSessions } from '@/hooks/useCoachSessions';
import { useInAppNotifications } from '@/hooks/useInAppNotifications';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MenteesCard from '@/components/dashboard/MenteesCard';
import ApplicationsStatsCard from '@/components/dashboard/ApplicationsStatsCard';
import UpcomingSessionsCard from '@/components/dashboard/UpcomingSessionsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bell } from 'lucide-react';

interface CoachDashboardContentProps {
  user: any;
}

const CoachDashboardContent = ({ user }: CoachDashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || user?.first_name || 'Coach';
  
  const { mentees, loading: menteesLoading } = useMentees();
  const { applications, loading: applicationsLoading } = useCoachApplications();
  const { sessions, loading: sessionsLoading } = useCoachSessions(user?.id);
  const { notifications, unreadCount } = useInAppNotifications();

  // Filter message notifications
  const messageNotifications = notifications.filter(n => n.type === 'message' && !n.isRead);

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
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 bg-white">
      <DashboardHeader user={user} firstName={firstName} />

      {/* Message Notifications Card - Show prominently if there are unread messages */}
      {messageNotifications.length > 0 && (
        <div className="mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <MessageCircle className="h-5 w-5" />
                New Messages ({messageNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messageNotifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="bg-white rounded-lg p-3 border border-blue-100">
                    <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                {messageNotifications.length > 3 && (
                  <p className="text-sm text-blue-700">
                    +{messageNotifications.length - 3} more messages
                  </p>
                )}
              </div>
              <Button 
                onClick={() => navigate('/coach/messages')} 
                className="w-full mt-4"
              >
                View All Messages
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Mentees</h3>
          <p className="text-3xl font-bold text-blue-600">{mentees.length}</p>
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

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unread Messages</h3>
          <p className="text-3xl font-bold text-blue-600">{messageNotifications.length}</p>
          <p className="text-sm text-gray-500 mt-1">New messages</p>
        </div>
      </div>
    </main>
  );
};

export default CoachDashboardContent;

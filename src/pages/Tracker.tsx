
import React, { useState, useEffect, memo, useMemo } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import Navigation from '@/components/Navigation';
import ExcelLikeJobApplicationsTable from '@/components/ExcelLikeJobApplicationsTable';
import EnhancedWeeklyJobRecommendations from '@/components/EnhancedWeeklyJobRecommendations';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, TrendingUp, Target, Award } from 'lucide-react';

const StatsCard = memo(({ title, value, icon: Icon, color }: {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
));

StatsCard.displayName = 'StatsCard';

const Tracker = memo(() => {
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const [isPageReady, setIsPageReady] = useState(false);

  const {
    applications,
    loading: applicationsLoading,
    handleAddApplication,
    handleUpdateApplication,
    handleDeleteApplication
  } = useJobApplicationsData(user);

  // Preserve scroll position
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('tracker-scroll-position');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }, 100);
    }
    setIsPageReady(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      try {
        localStorage.setItem('tracker-scroll-position', window.scrollY.toString());
      } catch (error) {
        console.error('Failed to save scroll position:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Clean up scroll position on unmount
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem('tracker-scroll-position');
      } catch (error) {
        console.error('Failed to clean up tracker localStorage:', error);
      }
    };
  }, []);

  // Memoize statistics calculations
  const statistics = useMemo(() => {
    const totalApplications = applications.length;
    const interviewingCount = applications.filter(app => app.application_status === 'interviewing').length;
    const offersCount = applications.filter(app => app.application_status === 'offer').length;
    
    const applicationsThisMonth = applications.filter(app => {
      const appDate = new Date(app.date_applied);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).length;

    return {
      totalApplications,
      interviewingCount,
      offersCount,
      applicationsThisMonth
    };
  }, [applications]);

  if (authLoading || !isPageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please log in to access the tracker.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto pt-28 py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Application Tracker</h1>
          <p className="text-gray-600 mt-2">Track and manage your job applications</p>
        </div>

        {/* Enhanced Job Recommendations Section with Archive System */}
        <div className="mb-8">
          <EnhancedWeeklyJobRecommendations userId={user.id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Applications" 
            value={statistics.totalApplications} 
            icon={BarChart} 
            color="text-indigo-600" 
          />
          <StatsCard 
            title="Interviewing" 
            value={statistics.interviewingCount} 
            icon={TrendingUp} 
            color="text-green-600" 
          />
          <StatsCard 
            title="Offers Received" 
            value={statistics.offersCount} 
            icon={Target} 
            color="text-purple-600" 
          />
          <StatsCard 
            title="Applications this month" 
            value={statistics.applicationsThisMonth} 
            icon={Award} 
            color="text-orange-600" 
          />
        </div>

        <div className="space-y-8">
          {applicationsLoading ? (
            <div className="text-center py-8">
              <div className="text-lg">Loading applications...</div>
            </div>
          ) : (
            <ExcelLikeJobApplicationsTable
              applications={applications}
              onAddApplication={handleAddApplication}
              onUpdateApplication={handleUpdateApplication}
              onDeleteApplication={handleDeleteApplication}
              isCoachView={false}
            />
          )}
        </div>
      </main>
    </div>
  );
});

Tracker.displayName = 'Tracker';

export default Tracker;

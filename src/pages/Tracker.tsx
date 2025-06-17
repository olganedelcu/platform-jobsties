
import React, { useState, useEffect, memo, useMemo } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import Navigation from '@/components/Navigation';
import ExcelLikeJobApplicationsTable from '@/components/ExcelLikeJobApplicationsTable';
import EnhancedWeeklyJobRecommendations from '@/components/EnhancedWeeklyJobRecommendations';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, Target, Award, Loader2, List, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('all');

  const {
    applications,
    loading: applicationsLoading,
    handleAddApplication,
    handleUpdateApplication,
    handleDeleteApplication,
    refetchApplications
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

  // Memoize statistics calculations and filtered applications
  const { statistics, filteredApplications } = useMemo(() => {
    const totalApplications = applications.length;
    const appliedCount = applications.filter(app => app.application_status === 'applied').length;
    const interviewingCount = applications.filter(app => app.application_status === 'interviewing').length;
    const rejectedCount = applications.filter(app => app.application_status === 'rejected').length;
    const offersCount = applications.filter(app => app.application_status === 'offer').length;
    
    const applicationsThisMonth = applications.filter(app => {
      const appDate = new Date(app.date_applied);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).length;

    // Filter applications based on active tab
    let filtered = applications;
    switch (activeTab) {
      case 'applied':
        filtered = applications.filter(app => app.application_status === 'applied');
        break;
      case 'interviewing':
        filtered = applications.filter(app => app.application_status === 'interviewing');
        break;
      case 'rejected':
        filtered = applications.filter(app => app.application_status === 'rejected');
        break;
      default:
        filtered = applications;
    }

    return {
      statistics: {
        totalApplications,
        appliedCount,
        interviewingCount,
        rejectedCount,
        offersCount,
        applicationsThisMonth
      },
      filteredApplications: filtered
    };
  }, [applications, activeTab]);

  if (authLoading || !isPageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
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
          <EnhancedWeeklyJobRecommendations 
            userId={user.id} 
            onApplicationAdded={refetchApplications}
          />
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
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <div className="text-lg">Loading applications...</div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border shadow-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="p-4 border-b">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      All
                      {statistics.totalApplications > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {statistics.totalApplications}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="applied" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Applied
                      {statistics.appliedCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {statistics.appliedCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="interviewing" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Interviewing
                      {statistics.interviewingCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {statistics.interviewingCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejected
                      {statistics.rejectedCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {statistics.rejectedCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <ExcelLikeJobApplicationsTable
                    applications={filteredApplications}
                    onAddApplication={handleAddApplication}
                    onUpdateApplication={handleUpdateApplication}
                    onDeleteApplication={handleDeleteApplication}
                    isCoachView={false}
                  />
                </TabsContent>

                <TabsContent value="applied" className="mt-0">
                  <ExcelLikeJobApplicationsTable
                    applications={filteredApplications}
                    onAddApplication={handleAddApplication}
                    onUpdateApplication={handleUpdateApplication}
                    onDeleteApplication={handleDeleteApplication}
                    isCoachView={false}
                  />
                </TabsContent>

                <TabsContent value="interviewing" className="mt-0">
                  <ExcelLikeJobApplicationsTable
                    applications={filteredApplications}
                    onAddApplication={handleAddApplication}
                    onUpdateApplication={handleUpdateApplication}
                    onDeleteApplication={handleDeleteApplication}
                    isCoachView={false}
                  />
                </TabsContent>

                <TabsContent value="rejected" className="mt-0">
                  <ExcelLikeJobApplicationsTable
                    applications={filteredApplications}
                    onAddApplication={handleAddApplication}
                    onUpdateApplication={handleUpdateApplication}
                    onDeleteApplication={handleDeleteApplication}
                    isCoachView={false}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
});

Tracker.displayName = 'Tracker';

export default Tracker;

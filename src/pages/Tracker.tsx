
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import Navigation from '@/components/Navigation';
import ExcelLikeJobApplicationsTable from '@/components/ExcelLikeJobApplicationsTable';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, TrendingUp, Target, Award } from 'lucide-react';

const Tracker = () => {
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const {
    applications,
    loading: applicationsLoading,
    handleAddApplication,
    handleUpdateApplication,
    handleDeleteApplication
  } = useJobApplicationsData(user);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate statistics
  const totalApplications = applications.length;
  const interviewingCount = applications.filter(app => app.application_status === 'interviewing').length;
  const offersCount = applications.filter(app => app.application_status === 'offer').length;
  const recentApplications = applications.filter(app => {
    const appDate = new Date(app.date_applied);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return appDate >= oneWeekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Application Tracker</h1>
          <p className="text-gray-600 mt-2">Track and manage your job applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-indigo-600">{totalApplications}</p>
                </div>
                <BarChart className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviewing</p>
                  <p className="text-2xl font-bold text-green-600">{interviewingCount}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offers Received</p>
                  <p className="text-2xl font-bold text-purple-600">{offersCount}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-orange-600">{recentApplications}</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
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
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Tracker;


import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import CoachDashboardContent from '@/components/CoachDashboardContent';
import PageWrapper from '@/components/layout/PageWrapper';

const CoachDashboard = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50 pt-16">
        <CoachDashboardContent user={user} />
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachDashboard;

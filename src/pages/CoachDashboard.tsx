
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
      <CoachDashboardContent user={user} />
    </ProtectedCoachRoute>
  );
};

export default CoachDashboard;

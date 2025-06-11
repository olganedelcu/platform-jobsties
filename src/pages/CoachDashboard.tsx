
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import CoachNavigation from '@/components/CoachNavigation';
import CoachDashboardContent from '@/components/CoachDashboardContent';

const CoachDashboard = () => {
  const { user, loading, handleSignOut } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <CoachNavigation user={user} onSignOut={handleSignOut} />
        <CoachDashboardContent user={user} />
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachDashboard;

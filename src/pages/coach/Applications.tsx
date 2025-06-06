
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import CoachNavigation from '@/components/CoachNavigation';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import ApplicationsContent from '@/components/coach/ApplicationsContent';

const Applications = () => {
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
        <ApplicationsContent />
      </div>
    </ProtectedCoachRoute>
  );
};

export default Applications;

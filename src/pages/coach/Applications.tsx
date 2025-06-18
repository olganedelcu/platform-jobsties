
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import ApplicationsContent from '@/components/coach/ApplicationsContent';
import PageWrapper from '@/components/layout/PageWrapper';

const Applications = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <ApplicationsContent />
      </div>
    </ProtectedCoachRoute>
  );
};

export default Applications;


import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import JobRecommendationsContainer from '@/components/coach/JobRecommendationsContainer';
import PageWrapper from '@/components/layout/PageWrapper';

const CoachJobRecommendations = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-8 px-6">
          <JobRecommendationsContainer user={user} />
        </main>
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachJobRecommendations;

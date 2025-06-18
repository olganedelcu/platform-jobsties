
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import CoachCalendar from '@/components/coach/Calendar';
import PageWrapper from '@/components/layout/PageWrapper';

const CoachCalendarPage = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-6">
        <CoachCalendar coachId={user.id} />
      </main>
    </div>
  );
};

export default CoachCalendarPage;

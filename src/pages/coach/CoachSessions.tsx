
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import SessionsHeader from '@/components/coach/SessionsHeader';
import CoachSessionsList from '@/components/coach/CoachSessionsList';
import PageWrapper from '@/components/layout/PageWrapper';
import { useCoachSessions } from '@/hooks/useCoachSessions';

const CoachSessions = () => {
  const { user, loading } = useAuthState();

  const { 
    sessions, 
    loading: sessionsLoading, 
    handleConfirmSession, 
    handleCancelSession 
  } = useCoachSessions(user);

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  if (loading || !user) {
    return <PageWrapper loading={true} />;
  }

  return (
    <PageWrapper className="max-w-7xl mx-auto py-8 px-6 pt-24">
      <SessionsHeader />
      
      <CoachSessionsList
        sessions={sessions}
        loading={sessionsLoading}
        onConfirmSession={handleConfirmSession}
        onCancelSession={handleCancelSession}
        onJoinMeeting={handleJoinMeeting}
      />
    </PageWrapper>
  );
};

export default CoachSessions;

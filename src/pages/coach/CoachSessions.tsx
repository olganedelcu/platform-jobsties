
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SessionsHeader from '@/components/coach/SessionsHeader';
import CoachSessionsList from '@/components/coach/CoachSessionsList';
import PageWrapper from '@/components/layout/PageWrapper';
import { useCoachSessions } from '@/hooks/useCoachSessions';

const CoachSessions = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/coach/login');
          return;
        }
        
        setUser(session.user);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/coach/login');
      }
    };

    checkUser();
  }, [navigate]);

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
    <PageWrapper className="max-w-7xl mx-auto py-8 px-6">
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

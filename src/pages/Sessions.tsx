
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SessionsPageHeader from '@/components/sessions/SessionsPageHeader';
import SessionsLoadingState from '@/components/sessions/SessionsLoadingState';
import UpcomingSessions from '@/components/sessions/UpcomingSessions';
import PastSessions from '@/components/sessions/PastSessions';
import SessionsEmptyState from '@/components/sessions/SessionsEmptyState';
import PageWrapper from '@/components/layout/PageWrapper';
import { useToast } from '@/hooks/use-toast';
import { useSessionsData } from '@/hooks/useSessionsData';

const Sessions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [sessionRefreshKey, setSessionRefreshKey] = useState(0);

  const {
    sessions,
    loading: sessionsLoading,
    handleAddSession,
    handleDeleteSession
  } = useSessionsData(user);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        console.log('User authenticated:', session.user.id);
        setUser(session.user);
        setAuthLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  const handleScheduleSession = async (sessionData: any) => {
    console.log('Scheduling session with data:', sessionData);
    
    try {
      await handleAddSession(sessionData);
      setShowScheduleDialog(false);
      setSessionRefreshKey(prev => prev + 1);
      
      toast({
        title: "Success",
        description: "Session scheduled successfully!",
      });
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = (sessionId: string) => {
    toast({
      title: "Reschedule Session",
      description: "Reschedule functionality will be available soon.",
    });
  };

  const handleCancel = async (sessionId: string) => {
    await handleDeleteSession(sessionId);
  };

  if (authLoading || !user) {
    return <PageWrapper loading={true} />;
  }

  return (
    <PageWrapper className="max-w-4xl mx-auto pt-32 pb-8 px-4">
      <SessionsPageHeader
        showScheduleDialog={showScheduleDialog}
        setShowScheduleDialog={setShowScheduleDialog}
        onScheduleSession={handleScheduleSession}
        userId={user?.id}
        sessionRefreshKey={sessionRefreshKey}
      />

      {sessionsLoading && <SessionsLoadingState />}

      {!sessionsLoading && sessions.length > 0 && (
        <div className="space-y-8">
          <UpcomingSessions
            sessions={sessions}
            onReschedule={handleReschedule}
            onCancel={handleDeleteSession}
          />
          
          <PastSessions
            sessions={sessions}
            onReschedule={handleReschedule}
            onCancel={handleDeleteSession}
          />
        </div>
      )}

      {!sessionsLoading && sessions.length === 0 && (
        <SessionsEmptyState onScheduleClick={() => setShowScheduleDialog(true)} />
      )}
    </PageWrapper>
  );
};

export default Sessions;

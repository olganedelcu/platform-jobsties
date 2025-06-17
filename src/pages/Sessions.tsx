
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import SessionsPageHeader from '@/components/sessions/SessionsPageHeader';
import SessionsLoadingState from '@/components/sessions/SessionsLoadingState';
import UpcomingSessions from '@/components/sessions/UpcomingSessions';
import PastSessions from '@/components/sessions/PastSessions';
import SessionsEmptyState from '@/components/sessions/SessionsEmptyState';
import { Loader2 } from 'lucide-react';
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
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        }
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <SessionsPageHeader
          showScheduleDialog={showScheduleDialog}
          setShowScheduleDialog={setShowScheduleDialog}
          onScheduleSession={handleScheduleSession}
          userId={user?.id}
          sessionRefreshKey={sessionRefreshKey}
        />

        {sessionsLoading && <SessionsLoadingState />}

        {!sessionsLoading && sessions.length > 0 && (
          <div className="space-y-12">
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
      </main>
    </div>
  );
};

export default Sessions;

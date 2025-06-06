
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CoachNavigation from '@/components/CoachNavigation';
import SessionsHeader from '@/components/coach/SessionsHeader';
import SessionsList from '@/components/coach/SessionsList';
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
          navigate('/login');
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

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
    <div className="min-h-screen bg-gray-50">
      <CoachNavigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <SessionsHeader />
        
        <SessionsList
          sessions={sessions}
          loading={sessionsLoading}
          onConfirmSession={handleConfirmSession}
          onCancelSession={handleCancelSession}
          onJoinMeeting={handleJoinMeeting}
        />
      </main>
    </div>
  );
};

export default CoachSessions;

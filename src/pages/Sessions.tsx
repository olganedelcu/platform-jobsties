
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ScheduleSession from '@/components/ScheduleSession';
import SessionCard from '@/components/SessionCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Loader2 } from 'lucide-react';
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

    // Check for existing session immediately
    checkUser();

    // Set up listener for future changes
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
      // Force refresh of the entire component to update availability
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
    // Force refresh to update availability
    setSessionRefreshKey(prev => prev + 1);
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
      
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coaching Sessions</h1>
            <p className="text-gray-600 mt-2">Schedule and manage your coaching sessions</p>
          </div>
          
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white w-full mx-4 sm:mx-auto">
              <ScheduleSession 
                key={sessionRefreshKey} // Force remount to refresh availability
                onSchedule={handleScheduleSession}
                onCancel={() => {
                  console.log('Cancelling session scheduling');
                  setShowScheduleDialog(false);
                }}
                userId={user?.id}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {sessionsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading sessions...</span>
          </div>
        )}

        {/* Sessions Grid */}
        {!sessionsLoading && sessions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onReschedule={handleReschedule}
                onCancel={handleDeleteSession}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!sessionsLoading && sessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled</h3>
            <p className="text-gray-500 mb-6">Get started by scheduling your first coaching session</p>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => setShowScheduleDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule Your First Session
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sessions;

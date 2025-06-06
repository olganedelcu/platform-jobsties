import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import SessionCard from '@/components/SessionCard';
import DashboardQuickLinks from '@/components/DashboardQuickLinks';
import ChatPopup from '@/components/ChatPopup';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Loader2 } from 'lucide-react';
import ScheduleSession from '@/components/ScheduleSession';
import { useSessionsData } from '@/hooks/useSessionsData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

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
        
        setUser(session.user);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleScheduleSession = async (sessionData: any) => {
    await handleAddSession(sessionData);
    setShowScheduleDialog(false);
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

  if (loading || sessionsLoading) {
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome, {user.user_metadata?.first_name}!
            </h1>
            <p className="text-gray-600 mt-2">Your coaching sessions</p>
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
                onSchedule={handleScheduleSession}
                onCancel={() => setShowScheduleDialog(false)}
                userId={user?.id}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Links Section */}
        <DashboardQuickLinks />

        {/* Sessions Grid */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
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

      {/* Chat Popup */}
      <ChatPopup userId={user.id} userEmail={user.email} />
    </div>
  );
};

export default Dashboard;

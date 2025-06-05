
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ScheduleSession from '@/components/ScheduleSession';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Video, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Sessions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'CV Review Session',
      date: 'June 15, 2024',
      time: '2:00 PM',
      coach: 'Sarah Johnson',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Interview Preparation',
      date: 'June 22, 2024',
      time: '3:00 PM',
      coach: 'Sarah Johnson',
      status: 'pending'
    }
  ]);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleScheduleSession = (sessionData: any) => {
    console.log('Scheduling session:', sessionData);
    const newSession = {
      id: sessions.length + 1,
      title: sessionData.sessionType,
      date: new Date(sessionData.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: sessionData.time,
      coach: sessionData.preferredCoach,
      status: 'pending'
    };
    
    setSessions([...sessions, newSession]);
    toast({
      title: "Session Scheduled",
      description: `Your ${sessionData.sessionType} session has been scheduled for ${sessionData.date} at ${sessionData.time}`,
    });
    setShowScheduleDialog(false);
  };

  const handleReschedule = (sessionId: number) => {
    toast({
      title: "Reschedule Session",
      description: "Reschedule functionality will be available soon.",
    });
  };

  const handleCancel = (sessionId: number) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
    toast({
      title: "Session Cancelled",
      description: "Your session has been cancelled successfully.",
    });
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
                onSchedule={handleScheduleSession}
                onCancel={() => setShowScheduleDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{session.title}</h3>
                  <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    session.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{session.coach}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-indigo-600">
                  <Video className="h-4 w-4" />
                  <span>Video Call</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button 
                  variant="outline" 
                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 flex-1"
                  onClick={() => handleReschedule(session.id)}
                >
                  Reschedule
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                  onClick={() => handleCancel(session.id)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>

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
    </div>
  );
};

export default Sessions;

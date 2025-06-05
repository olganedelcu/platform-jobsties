
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CoachNavigation from '@/components/CoachNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CoachSessions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'CV Review Session',
      date: 'June 15, 2024',
      time: '2:00 PM',
      mentee: 'John Smith',
      menteeEmail: 'john.smith@email.com',
      status: 'confirmed',
      type: 'CV Review',
      meetingLink: 'https://meet.google.com/abc-def-ghi'
    },
    {
      id: 2,
      title: 'Interview Preparation',
      date: 'June 22, 2024',
      time: '3:00 PM',
      mentee: 'Sarah Johnson',
      menteeEmail: 'sarah.johnson@email.com',
      status: 'pending',
      type: 'Interview Prep',
      meetingLink: 'https://meet.google.com/xyz-uvw-rst'
    },
    {
      id: 3,
      title: 'Career Planning',
      date: 'June 18, 2024',
      time: '1:00 PM',
      mentee: 'Michael Brown',
      menteeEmail: 'michael.brown@email.com',
      status: 'confirmed',
      type: 'Career Planning',
      meetingLink: 'https://meet.google.com/mno-pqr-stu'
    },
    {
      id: 4,
      title: 'Mock Interview',
      date: 'June 25, 2024',
      time: '4:00 PM',
      mentee: 'John Smith',
      menteeEmail: 'john.smith@email.com',
      status: 'pending',
      type: 'Mock Interview',
      meetingLink: 'https://meet.google.com/def-ghi-jkl'
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

  const handleConfirmSession = (sessionId: number) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'confirmed' }
        : session
    ));
    toast({
      title: "Session Confirmed",
      description: "The session has been confirmed successfully.",
    });
  };

  const handleCancelSession = (sessionId: number) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
    toast({
      title: "Session Cancelled",
      description: "The session has been cancelled and the mentee will be notified.",
    });
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

  const confirmedSessions = sessions.filter(session => session.status === 'confirmed');
  const pendingSessions = sessions.filter(session => session.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Session Management</h1>
          <p className="text-gray-600 mt-2">View and manage scheduled sessions with your mentees</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Sessions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Sessions ({pendingSessions.length})
            </h2>
            <div className="space-y-4">
              {pendingSessions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending sessions</p>
                  </CardContent>
                </Card>
              ) : (
                pendingSessions.map((session) => (
                  <Card key={session.id} className="border-yellow-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <Badge variant="outline" className="mt-1 border-yellow-500 text-yellow-700">
                            {session.status}
                          </Badge>
                        </div>
                        <Badge variant="secondary">{session.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
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
                          <span>{session.mentee}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleConfirmSession(session.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleCancelSession(session.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Confirmed Sessions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Confirmed Sessions ({confirmedSessions.length})
            </h2>
            <div className="space-y-4">
              {confirmedSessions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No confirmed sessions</p>
                  </CardContent>
                </Card>
              ) : (
                confirmedSessions.map((session) => (
                  <Card key={session.id} className="border-green-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <Badge className="mt-1 bg-green-100 text-green-800">
                            {session.status}
                          </Badge>
                        </div>
                        <Badge variant="secondary">{session.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
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
                          <span>{session.mentee}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-indigo-600">
                          <Video className="h-4 w-4" />
                          <span>Video Call Ready</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleJoinMeeting(session.meetingLink)}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleCancelSession(session.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoachSessions;

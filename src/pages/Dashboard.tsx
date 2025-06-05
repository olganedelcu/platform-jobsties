
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { BookOpen, Calendar, Users, BarChart } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.user_metadata?.first_name}!</h1>
          <p className="text-gray-600 mt-2">Here's your career development overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Progress</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-sm text-gray-600">0%</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Continue your career development journey</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Sessions</h3>
            <p className="text-2xl font-bold text-indigo-600">2</p>
            <p className="text-sm text-gray-500">Sessions scheduled this week</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Completion</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="text-sm text-gray-600">30%</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Complete your profile to get better matches</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/course')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="font-medium">Continue Course</p>
              <p className="text-sm text-gray-500">Resume learning</p>
            </button>
            
            <button 
              onClick={() => navigate('/sessions')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="font-medium">Book Session</p>
              <p className="text-sm text-gray-500">Schedule coaching</p>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="font-medium">Edit Profile</p>
              <p className="text-sm text-gray-500">Update information</p>
            </button>
            
            <button 
              onClick={() => navigate('/tracker')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <BarChart className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="font-medium">View Progress</p>
              <p className="text-sm text-gray-500">Track achievements</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

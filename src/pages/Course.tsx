
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { FileText, Linkedin, Search, Video, MessageCircle, Lock } from 'lucide-react';

const Course = () => {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const courseModules = [
    {
      title: 'CV Optimization',
      description: 'Perfect your CV to stand out to employers',
      icon: FileText,
      completed: false,
      locked: false,
      action: 'Download Document'
    },
    {
      title: 'LinkedIn & Cover Letter',
      description: 'Build your professional brand and write compelling cover letters',
      icon: Linkedin,
      completed: false,
      locked: false,
      action: null
    },
    {
      title: 'Job Search Strategy',
      description: 'Develop an effective job search approach',
      icon: Search,
      completed: false,
      locked: true,
      action: null
    },
    {
      title: 'Interview Preparation',
      description: 'Master the art of interviewing',
      icon: Video,
      completed: false,
      locked: true,
      action: null
    },
    {
      title: 'Feedback & Next Steps',
      description: 'Review progress and plan future actions',
      icon: MessageCircle,
      completed: false,
      locked: true,
      action: null
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Career Development Course</h1>
          <p className="text-gray-600 mt-2">Your personalized journey to career success</p>
          
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">0% Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div 
                key={index}
                className={`bg-white rounded-lg shadow p-6 ${module.locked ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${module.locked ? 'bg-gray-100' : 'bg-gradient-to-r from-indigo-100 to-purple-100'}`}>
                      {module.locked ? (
                        <Lock className="h-6 w-6 text-gray-400" />
                      ) : (
                        <Icon className={`h-6 w-6 ${module.locked ? 'text-gray-400' : 'text-indigo-600'}`} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  {module.locked && (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                {module.action && !module.locked && (
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    onClick={() => {
                      console.log(`Starting ${module.title}`);
                    }}
                  >
                    {module.action}
                  </Button>
                )}
                
                {module.locked && (
                  <div className="text-sm text-gray-500">
                    Complete previous modules to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Course;

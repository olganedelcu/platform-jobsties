
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import CourseHeader from '@/components/course/CourseHeader';
import CourseModule from '@/components/course/CourseModule';
import { courseModules } from '@/data/courseModules';

const Course = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(0); // Default to first module expanded

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

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
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
        <CourseHeader progress={0} />

        <div className="space-y-6">
          {courseModules.map((module, index) => (
            <CourseModule
              key={index}
              module={module}
              index={index}
              expanded={expandedModule === index}
              userId={user.id}
              onToggle={() => toggleModule(index)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Course;

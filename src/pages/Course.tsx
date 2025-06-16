
import React from 'react';
import { useCourseAuth } from '@/hooks/useCourseAuth';
import Navigation from '@/components/Navigation';
import CourseContent from '@/components/course/CourseContent';
import { Loader2 } from 'lucide-react';

const Course = () => {
  const { user, loading, handleSignOut } = useCourseAuth();

  if (loading) {
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
    <div className="min-h-screen bg-white">
      <Navigation user={user} onSignOut={handleSignOut} />
      <div className="pt-20">
        <CourseContent userId={user.id} />
      </div>
    </div>
  );
};

export default Course;

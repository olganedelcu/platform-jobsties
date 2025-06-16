
import React from 'react';
import { useCourseAuth } from '@/hooks/useCourseAuth';
import Navigation from '@/components/Navigation';
import CourseContent from '@/components/course/CourseContent';

const Course = () => {
  const { user, loading, handleSignOut } = useCourseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
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

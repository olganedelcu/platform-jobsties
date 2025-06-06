
import React from 'react';
import { useCourseAuth } from '@/hooks/useCourseAuth';
import Navigation from '@/components/Navigation';
import CourseContent from '@/components/course/CourseContent';

const Course = () => {
  const { user, loading, handleSignOut } = useCourseAuth();

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
      <CourseContent userId={user.id} />
    </div>
  );
};

export default Course;

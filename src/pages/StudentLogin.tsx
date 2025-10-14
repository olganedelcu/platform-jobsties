import React from 'react';
import StudentLoginCard from '@/components/student/StudentLoginCard';

const StudentLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <StudentLoginCard />
      </div>
    </div>
  );
};

export default StudentLogin;

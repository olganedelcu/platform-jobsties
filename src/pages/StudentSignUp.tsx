import React from 'react';
import StudentSignUpCard from '@/components/student/StudentSignUpCard';

const StudentSignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <StudentSignUpCard />
      </div>
    </div>
  );
};

export default StudentSignUp;

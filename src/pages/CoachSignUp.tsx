
import React from 'react';
import CoachSignUpCard from '@/components/CoachSignUpCard';

const CoachSignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <CoachSignUpCard />
      </div>
    </div>
  );
};

export default CoachSignUp;

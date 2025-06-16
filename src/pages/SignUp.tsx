
import React from 'react';
import SignUpCard from '@/components/SignUpCard';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <SignUpCard />
      </div>
    </div>
  );
};

export default SignUp;

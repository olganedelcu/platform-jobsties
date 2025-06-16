
import React from 'react';
import LoginCard from '@/components/auth/LoginCard';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;

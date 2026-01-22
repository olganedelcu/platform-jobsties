
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SignUpCardHeader = () => {
  return (
    <CardHeader className="space-y-4 text-center bg-white rounded-t-lg px-6 py-8">
      <div className="flex justify-center">
        <img
          src="/assets/logo-white.png"
          alt="JobSties Logo"
          className="h-16 w-auto"
        />
      </div>
      <CardTitle className="text-2xl text-gray-900">Create an Account</CardTitle>
      <CardDescription className="text-gray-600">Join our community today</CardDescription>
      <div className="h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 -mx-6"></div>
    </CardHeader>
  );
};

export default SignUpCardHeader;

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const StudentSignUpHeader = () => {
  return (
    <CardHeader className="space-y-4 text-center bg-white rounded-t-lg px-6 py-8">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
          alt="JobSties Logo" 
          className="h-16 w-auto"
        />
      </div>
      <CardTitle className="text-2xl text-gray-900">Join as a Student</CardTitle>
      <CardDescription className="text-gray-600">Create your account to get started</CardDescription>
      <div className="h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 -mx-6"></div>
    </CardHeader>
  );
};

export default StudentSignUpHeader;

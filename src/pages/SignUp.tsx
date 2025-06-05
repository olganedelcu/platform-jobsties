
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignUpForm from '@/components/SignUpForm';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-4 text-center bg-white rounded-t-lg px-6 py-8">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                alt="JobSties Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl text-gray-900">Create an Account</CardTitle>
            <CardDescription className="text-gray-600">Join our community today</CardDescription>
            <div className="h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 -mx-6"></div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SignUpCardHeader from './SignUpCardHeader';
import SignUpForm from './SignUpForm';

const SignUpCard = () => {
  return (
    <Card className="border-none shadow-xl">
      <SignUpCardHeader />
      <CardContent className="p-6 sm:p-8">
        <SignUpForm />
      </CardContent>
    </Card>
  );
};

export default SignUpCard;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SignUpCardHeader from './SignUpCardHeader';
import CoachSignUpForm from './CoachSignUpForm';

const CoachSignUpCard = () => {
  return (
    <Card className="border-none shadow-xl">
      <SignUpCardHeader />
      <CardContent className="p-6 sm:p-8">
        <CoachSignUpForm />
      </CardContent>
    </Card>
  );
};

export default CoachSignUpCard;

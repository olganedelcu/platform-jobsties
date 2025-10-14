import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StudentSignUpHeader from './StudentSignUpHeader';
import StudentSignUpForm from './StudentSignUpForm';

const StudentSignUpCard = () => {
  return (
    <Card className="border-none shadow-xl">
      <StudentSignUpHeader />
      <CardContent className="p-6 sm:p-8">
        <StudentSignUpForm />
      </CardContent>
    </Card>
  );
};

export default StudentSignUpCard;

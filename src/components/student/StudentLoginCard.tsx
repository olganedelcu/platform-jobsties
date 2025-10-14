import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StudentLoginHeader from './StudentLoginHeader';
import StudentLoginForm from './StudentLoginForm';

const StudentLoginCard = () => {
  return (
    <Card className="border-none shadow-xl">
      <StudentLoginHeader />
      <CardContent className="p-6 sm:p-8">
        <StudentLoginForm />
      </CardContent>
    </Card>
  );
};

export default StudentLoginCard;

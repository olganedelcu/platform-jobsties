
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';

const LoginCard = () => {
  return (
    <Card className="border-none shadow-xl">
      <LoginHeader />
      <CardContent className="p-6 sm:p-8">
        <LoginForm />
      </CardContent>
    </Card>
  );
};

export default LoginCard;

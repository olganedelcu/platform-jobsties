
import React from 'react';
import { Button } from '@/components/ui/button';

interface MenteeTodosAuthErrorProps {
  onLogin: () => void;
}

const MenteeTodosAuthError = ({ onLogin }: MenteeTodosAuthErrorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg mb-4">Authentication required</div>
        <Button onClick={onLogin}>Go to Login</Button>
      </div>
    </div>
  );
};

export default MenteeTodosAuthError;

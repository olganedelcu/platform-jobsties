
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useMenteeTodosAuth } from '@/hooks/useMenteeTodosAuth';
import MenteeTodosLoadingState from '@/components/mentee/MenteeTodosLoadingState';
import MenteeTodosAuthError from '@/components/mentee/MenteeTodosAuthError';
import MenteeTodosContainer from '@/components/mentee/MenteeTodosContainer';

const MenteeTodos = () => {
  const navigate = useNavigate();
  const { user, loading, handleSignOut } = useMenteeTodosAuth();

  if (loading) {
    return <MenteeTodosLoadingState />;
  }

  if (!user) {
    return <MenteeTodosAuthError onLogin={() => navigate('/login')} />;
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      <MenteeTodosContainer userId={user.id} />
    </div>
  );
};

export default MenteeTodos;

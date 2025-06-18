
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import MenteesContent from '@/components/MenteesContent';
import PageWrapper from '@/components/layout/PageWrapper';

const Mentees = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <MenteesContent />
      </div>
    </ProtectedCoachRoute>
  );
};

export default Mentees;

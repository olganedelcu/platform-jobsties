
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import PageWrapper from '@/components/layout/PageWrapper';

const CoachMessages = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MessagingInterface />
    </div>
  );
};

export default CoachMessages;

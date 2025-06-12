
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import CoachNavigation from '@/components/CoachNavigation';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { Loader2 } from 'lucide-react';

const CoachMessages = () => {
  const { user, loading, handleSignOut } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavigation user={user} onSignOut={handleSignOut} />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with your mentees and manage conversations</p>
        </div>
        <MessagingInterface />
      </div>
    </div>
  );
};

export default CoachMessages;


import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import Navigation from '@/components/Navigation';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { Loader2 } from 'lucide-react';

const Messages = () => {
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
      <Navigation user={user} onSignOut={handleSignOut} />
      <MessagingInterface />
    </div>
  );
};

export default Messages;

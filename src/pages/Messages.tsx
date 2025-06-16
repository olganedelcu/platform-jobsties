
import React, { useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { Loader2 } from 'lucide-react';

const Messages = () => {
  const { user, loading, handleSignOut } = useAuthState();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('conversation');

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
    <div className="min-h-screen bg-white">
      <Navigation user={user} onSignOut={handleSignOut} />
      <div className="pt-20">
        <MessagingInterface initialConversationId={conversationId} />
      </div>
    </div>
  );
};

export default Messages;

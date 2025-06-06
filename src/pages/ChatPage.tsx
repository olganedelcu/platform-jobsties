
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import Navigation from '@/components/Navigation';
import Chat from '@/components/Chat';

const ChatPage = () => {
  const { user, loading, handleSignOut } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-4xl mx-auto py-8 px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chat with Your Coach
          </h1>
          <p className="text-gray-600">
            Connect with Ana for personalized career guidance and support.
          </p>
        </div>
        
        <Chat userId={user.id} userEmail={user.email} />
      </main>
    </div>
  );
};

export default ChatPage;

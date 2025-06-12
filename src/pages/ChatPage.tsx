
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

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
            Chat Feature
          </h1>
          <p className="text-gray-600">
            Chat functionality has been removed from the platform.
          </p>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chat feature removed</h3>
            <p className="text-gray-500">This functionality is no longer available.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChatPage;

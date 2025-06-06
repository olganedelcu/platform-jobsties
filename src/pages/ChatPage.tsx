
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import Navigation from '@/components/Navigation';
import SimpleChat from '@/components/SimpleChat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Construction } from 'lucide-react';

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
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <Construction className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Feature in Development:</strong> This chat feature is currently being built. 
            Your messages will be sent directly to Ana's email inbox for now.
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chat with Your Coach
          </h1>
          <p className="text-gray-600">
            Send a message to Ana and she'll respond via email.
          </p>
        </div>
        
        <SimpleChat user={user} />
      </main>
    </div>
  );
};

export default ChatPage;

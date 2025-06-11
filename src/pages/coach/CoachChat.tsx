
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import CoachNavigation from '@/components/CoachNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const CoachChat = () => {
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
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <CoachNavigation user={user} onSignOut={handleSignOut} />
        
        <main className="max-w-7xl mx-auto py-8 px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chat Conversations</h2>
          
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chat feature has been removed</h3>
              <p className="text-gray-500">This functionality is no longer available.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachChat;

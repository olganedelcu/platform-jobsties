
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import CommunityContent from '@/components/community/CommunityContent';

const Community = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access the community</h2>
          <p className="text-gray-600">You need to be logged in to view and interact with the community.</p>
        </div>
      </div>
    );
  }

  return <CommunityContent user={user} />;
};

export default Community;

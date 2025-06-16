
import React from 'react';
import { useMenteeTodosAuth } from '@/hooks/useMenteeTodosAuth';
import Navigation from '@/components/Navigation';
import { Loader2 } from 'lucide-react';
import MenteeTodosTabsContent from '@/components/mentee/MenteeTodosTabsContent';

const MenteeTodosPage = () => {
  const { user, loading, handleSignOut } = useMenteeTodosAuth();

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
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <MenteeTodosTabsContent userId={user.id} />
        </main>
      </div>
    </div>
  );
};

export default MenteeTodosPage;

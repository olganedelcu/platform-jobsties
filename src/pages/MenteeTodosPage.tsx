
import React, { useState, useEffect } from 'react';
import { useMenteeTodosAuth } from '@/hooks/useMenteeTodosAuth';
import Navigation from '@/components/Navigation';
import { Loader2 } from 'lucide-react';
import LazyMenteeTodosContent from '@/components/mentee/LazyMenteeTodosContent';

const MenteeTodosPage = () => {
  const { user, loading, handleSignOut } = useMenteeTodosAuth();
  const [isPageReady, setIsPageReady] = useState(false);

  // Preserve scroll position
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('todos-scroll-position');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }, 100);
    }
    setIsPageReady(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      try {
        localStorage.setItem('todos-scroll-position', window.scrollY.toString());
      } catch (error) {
        console.error('Failed to save scroll position:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Clean up scroll position on unmount
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem('todos-scroll-position');
      } catch (error) {
        console.error('Failed to clean up todos localStorage:', error);
      }
    };
  }, []);

  if (loading || !isPageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading your tasks...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} onSignOut={handleSignOut} />
      <div className="pt-20">
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <LazyMenteeTodosContent userId={user.id} />
        </main>
      </div>
    </div>
  );
};

export default MenteeTodosPage;

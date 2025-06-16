
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import Navigation from '@/components/Navigation';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { Loader2 } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  usePagePerformance('Messages');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate('/login');
        return;
      }

      setUser(user);
    } catch (error: any) {
      console.error('Auth check error:', error);
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading messages...</div>
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
        <main className="max-w-7xl mx-auto py-8 px-6">
          <MessagingInterface />
        </main>
      </div>
    </div>
  );
};

export default Messages;

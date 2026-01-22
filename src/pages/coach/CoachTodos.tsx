
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TodoList from '@/components/TodoList';
import PageWrapper from '@/components/layout/PageWrapper';
import { User } from '@supabase/supabase-js';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const CoachTodos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        navigate('/coach-login');
        return;
      }

      // Check if user is a coach
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || profile?.role !== 'COACH') {
        toast({
          title: "Access Denied",
          description: "You must be a coach to access this page",
          variant: "destructive"
        });
        navigate('/coach-login');
        return;
      }

      setUser(user);
      await fetchMentees();
    } catch (error: unknown) {
      console.error('Auth check error:', error);
      navigate('/coach-login');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'MENTEE');

      if (error) throw error;
      setMentees(data || []);
    } catch (error: unknown) {
      console.error('Error fetching mentees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentees",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-7xl mx-auto py-8 px-6">
        <TodoList mentees={mentees} coachId={user.id} />
      </main>
    </div>
  );
};

export default CoachTodos;

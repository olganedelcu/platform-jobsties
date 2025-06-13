
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { useMenteeTodos } from '@/hooks/useMenteeTodos';
import MenteeTodosHeader from '@/components/mentee/MenteeTodosHeader';
import MenteeTodosTabNavigation from '@/components/mentee/MenteeTodosTabNavigation';
import AssignmentsTabContent from '@/components/mentee/AssignmentsTabContent';
import PersonalTodosTabContent from '@/components/mentee/PersonalTodosTabContent';

const MenteeTodos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'assignments' | 'personal'>('assignments');

  // Hooks for todo management - only initialize when we have a user
  const { assignments, loading: assignmentsLoading, updateStatus } = useTodoAssignments(user?.id || '', false);
  const { todos, loading: todosLoading, addTodo, updateStatus: updateTodoStatus, deleteTodo } = useMenteeTodos(user?.id || '');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
        navigate('/login');
        return;
      }

      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Authenticated user:', user.id, user.email);

      // Check if user is a mentee
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('Profile data:', profile);
      console.log('Profile error:', profileError);

      if (profileError) {
        console.error('Profile error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      if (profile?.role !== 'MENTEE') {
        console.log('User is not a mentee, role:', profile?.role);
        toast({
          title: "Access Denied",
          description: "You must be a mentee to access this page",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      console.log('User authenticated as mentee successfully');
      setUser(user);
    } catch (error: any) {
      console.error('Auth check error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to verify authentication",
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

  const handleAddTodo = async (todoData: any) => {
    await addTodo(todoData);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Authentication required</div>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  console.log('Rendering MenteeTodos with user:', user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <MenteeTodosHeader />

        <MenteeTodosTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          assignmentsCount={assignments.length}
          todosCount={todos.length}
        />

        {/* Content based on active tab */}
        {activeTab === 'assignments' && (
          <AssignmentsTabContent userId={user.id} />
        )}

        {activeTab === 'personal' && (
          <PersonalTodosTabContent
            todos={todos}
            showAddForm={showAddForm}
            todosLoading={todosLoading}
            userId={user.id}
            onShowAddForm={() => setShowAddForm(true)}
            onAddTodo={handleAddTodo}
            onCancelAdd={() => setShowAddForm(false)}
            onUpdateStatus={updateTodoStatus}
            onDeleteTodo={deleteTodo}
          />
        )}
      </main>
    </div>
  );
};

export default MenteeTodos;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { useMenteeTodos } from '@/hooks/useMenteeTodos';
import MenteeAssignmentsList from '@/components/MenteeAssignmentsList';
import MenteePersonalTodosList from '@/components/MenteePersonalTodosList';
import MenteeTodoForm from '@/components/MenteeTodoForm';

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-2">Manage your assigned tasks and personal todos</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'assignments'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Coach Assignments ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'personal'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Personal Todos ({todos.length})
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'assignments' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tasks from Your Coach</h2>
              <p className="text-gray-600">Complete tasks assigned by your coach</p>
            </div>
            <MenteeAssignmentsList userId={user.id} />
          </div>
        )}

        {activeTab === 'personal' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Personal Todos</h2>
                <p className="text-gray-600">Create and manage your own weekly todo list</p>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Todo</span>
              </Button>
            </div>

            {showAddForm && (
              <div className="mb-6">
                <MenteeTodoForm
                  onAddTodo={handleAddTodo}
                  onCancel={() => setShowAddForm(false)}
                  menteeId={user.id}
                />
              </div>
            )}

            {todosLoading ? (
              <div className="text-center py-8">
                <div className="text-lg">Loading your todos...</div>
              </div>
            ) : (
              <MenteePersonalTodosList
                todos={todos}
                onUpdateStatus={updateTodoStatus}
                onDeleteTodo={deleteTodo}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenteeTodos;

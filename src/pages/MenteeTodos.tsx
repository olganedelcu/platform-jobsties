
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useDashboardTaskBoard } from '@/hooks/useDashboardTaskBoard';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { useMenteeTodos } from '@/hooks/useMenteeTodos';
import MenteeAssignmentsList from '@/components/MenteeAssignmentsList';
import CoachAssignmentsBoard from '@/components/coach/CoachAssignmentsBoard';
import MenteePersonalTodosList from '@/components/MenteePersonalTodosList';
import MenteeTaskBoard from '@/components/mentee/MenteeTaskBoard';
import MenteeTodoForm from '@/components/MenteeTodoForm';

const MenteeTodos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assignmentsViewMode, setAssignmentsViewMode] = useState<'list' | 'board'>('list');
  const [personalViewMode, setPersonalViewMode] = useState<'list' | 'board'>('list');
  const [showAddForm, setShowAddForm] = useState(false);

  // Get personal tasks and assignments
  const { tasks: personalTasks, loading: personalLoading } = useDashboardTaskBoard(user?.id || '');
  const { assignments, loading: assignmentsLoading } = useTodoAssignments(user?.id || '', false);
  const { todos, loading: todosLoading, addTodo, updateStatus: updateTodoStatus, deleteTodo } = useMenteeTodos(user?.id || '');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
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

  // Calculate task statistics
  const personalPending = todos.filter(task => task.status === 'pending').length;
  const personalInProgress = todos.filter(task => task.status === 'in_progress').length;
  const personalCompleted = todos.filter(task => task.status === 'completed').length;

  const assignmentsPending = assignments.filter(assignment => assignment.status === 'pending').length;
  const assignmentsInProgress = assignments.filter(assignment => assignment.status === 'in_progress').length;
  const assignmentsCompleted = assignments.filter(assignment => assignment.status === 'completed').length;

  const totalPending = personalPending + assignmentsPending;
  const totalInProgress = personalInProgress + assignmentsInProgress;
  const totalCompleted = personalCompleted + assignmentsCompleted;

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} onSignOut={handleSignOut} />
      <div className="pt-20">
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
          {/* Task Overview Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="text-center p-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">{totalPending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalInProgress}</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{totalCompleted}</div>
                <div className="text-sm text-gray-500">Done</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All Tasks
                <Badge variant="secondary" className="bg-gray-100">
                  {todos.length + assignments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                Personal Tasks
                <Badge variant="secondary" className="bg-blue-100">
                  {todos.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                Coach Assignments
                <Badge variant="secondary" className="bg-purple-100">
                  {assignments.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-8">
                {/* Coach Assignments Section */}
                {assignments.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        Coach Assignments
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {assignments.length}
                        </Badge>
                      </h2>
                      <Button
                        onClick={() => setAssignmentsViewMode(assignmentsViewMode === 'list' ? 'board' : 'list')}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        {assignmentsViewMode === 'list' ? (
                          <>
                            <LayoutGrid className="h-4 w-4" />
                            <span>Board View</span>
                          </>
                        ) : (
                          <>
                            <List className="h-4 w-4" />
                            <span>List View</span>
                          </>
                        )}
                      </Button>
                    </div>
                    {assignmentsViewMode === 'list' ? (
                      <MenteeAssignmentsList userId={user.id} />
                    ) : (
                      <CoachAssignmentsBoard coachId={user.id} />
                    )}
                  </div>
                )}

                {/* Personal Tasks Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      Personal Tasks
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {todos.length}
                      </Badge>
                    </h2>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setPersonalViewMode(personalViewMode === 'list' ? 'board' : 'list')}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        {personalViewMode === 'list' ? (
                          <>
                            <LayoutGrid className="h-4 w-4" />
                            <span>Board View</span>
                          </>
                        ) : (
                          <>
                            <List className="h-4 w-4" />
                            <span>List View</span>
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Task</span>
                      </Button>
                    </div>
                  </div>

                  {showAddForm && (
                    <div className="mb-6">
                      <MenteeTodoForm
                        menteeId={user.id}
                        onAddTodo={handleAddTodo}
                        onCancel={() => setShowAddForm(false)}
                      />
                    </div>
                  )}

                  {personalViewMode === 'list' ? (
                    <MenteePersonalTodosList
                      todos={todos}
                      onUpdateStatus={updateTodoStatus}
                      onDeleteTodo={deleteTodo}
                    />
                  ) : (
                    <MenteeTaskBoard userId={user.id} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">My Personal Tasks</h2>
                    <p className="text-gray-600">Create and manage your personal tasks</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setPersonalViewMode(personalViewMode === 'list' ? 'board' : 'list')}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      {personalViewMode === 'list' ? (
                        <>
                          <LayoutGrid className="h-4 w-4" />
                          <span>Board View</span>
                        </>
                      ) : (
                        <>
                          <List className="h-4 w-4" />
                          <span>List View</span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Task</span>
                    </Button>
                  </div>
                </div>

                {showAddForm && (
                  <MenteeTodoForm
                    menteeId={user.id}
                    onAddTodo={handleAddTodo}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}

                <div className="space-y-4">
                  {todosLoading ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-gray-500">Loading your tasks...</p>
                      </CardContent>
                    </Card>
                  ) : personalViewMode === 'list' ? (
                    <MenteePersonalTodosList
                      todos={todos}
                      onUpdateStatus={updateTodoStatus}
                      onDeleteTodo={deleteTodo}
                    />
                  ) : (
                    <MenteeTaskBoard userId={user.id} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Tasks from Your Coach</h2>
                    <p className="text-gray-600">Complete tasks assigned by your coach</p>
                  </div>
                  <Button
                    onClick={() => setAssignmentsViewMode(assignmentsViewMode === 'list' ? 'board' : 'list')}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    {assignmentsViewMode === 'list' ? (
                      <>
                        <LayoutGrid className="h-4 w-4" />
                        <span>Board View</span>
                      </>
                    ) : (
                      <>
                        <List className="h-4 w-4" />
                        <span>List View</span>
                      </>
                    )}
                  </Button>
                </div>
                {assignmentsViewMode === 'list' ? (
                  <MenteeAssignmentsList userId={user.id} />
                ) : (
                  <CoachAssignmentsBoard coachId={user.id} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MenteeTodos;

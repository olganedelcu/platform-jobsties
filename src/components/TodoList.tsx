import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, LayoutGrid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import SendTodosToMentees from './coach/SendTodosToMentees';
import TaskTodoBoard from './todos/TaskTodoBoard';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  mentee_id: string;
  created_at: string;
  updated_at: string;
}

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface TodoListProps {
  mentees: Mentee[];
  coachId: string;
}

const TodoList = ({ mentees, coachId }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSendToMentees, setShowSendToMentees] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchTodos();
  }, [coachId]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coach_todos')
        .select('*')
        .eq('coach_id', coachId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure it matches our Todo interface
      const typedTodos: Todo[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'in_progress' | 'completed',
        priority: item.priority as 'low' | 'medium' | 'high'
      }));
      
      setTodos(typedTodos);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos([newTodo, ...todos]);
    setShowAddForm(false);
  };

  const handleTodoUpdated = (todoId: string, updatedTodo: Partial<Todo>) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, ...updatedTodo } : todo
    ));
  };

  const handleTodoDeleted = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  if (loading && viewMode === 'list') {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  if (viewMode === 'board') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
          <div className="flex gap-3">
            <Button
              onClick={() => setViewMode('list')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <List className="h-4 w-4" />
              <span>List View</span>
            </Button>
            <Button
              onClick={() => setShowSendToMentees(!showSendToMentees)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Send to Mentees</span>
            </Button>
          </div>
        </div>

        {/* Send to Mentees Section */}
        {showSendToMentees && (
          <SendTodosToMentees coachId={coachId} />
        )}

        <TaskTodoBoard coachId={coachId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setViewMode('board')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Board View</span>
          </Button>
          <Button
            onClick={() => setShowSendToMentees(!showSendToMentees)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Send to Mentees</span>
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Personal Todo</span>
          </Button>
        </div>
      </div>

      {/* Send to Mentees Section */}
      {showSendToMentees && (
        <SendTodosToMentees coachId={coachId} />
      )}

      {/* Personal Todo Form */}
      {showAddForm && (
        <TodoForm
          mentees={mentees}
          coachId={coachId}
          onTodoAdded={handleTodoAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Personal Todos List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">My Personal Todos</h3>
        <div className="grid gap-4">
          {todos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No personal todos yet. Add your first todo to get started!</p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                mentees={mentees}
                onTodoUpdated={handleTodoUpdated}
                onTodoDeleted={handleTodoDeleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;

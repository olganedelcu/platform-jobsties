
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TodoForm from './TodoForm';
import SendTodosToMentees from './coach/SendTodosToMentees';
import TodoListHeader from './todos/TodoListHeader';
import TodoListBoardView from './todos/TodoListBoardView';
import PersonalTodosSection from './todos/PersonalTodosSection';

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
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
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
    } catch (error: unknown) {
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

  const handleToggleSendToMentees = () => {
    setShowSendToMentees(!showSendToMentees);
  };

  if (loading && viewMode === 'list') {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  if (viewMode === 'board') {
    return (
      <TodoListBoardView
        coachId={coachId}
        showSendToMentees={showSendToMentees}
        onViewModeChange={setViewMode}
        onToggleSendToMentees={handleToggleSendToMentees}
      />
    );
  }

  return (
    <div className="space-y-6">
      <TodoListHeader
        viewMode={viewMode}
        showSendToMentees={showSendToMentees}
        onViewModeChange={setViewMode}
        onToggleSendToMentees={handleToggleSendToMentees}
        onShowAddForm={() => setShowAddForm(true)}
      />

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
      <PersonalTodosSection
        todos={todos}
        mentees={mentees}
        onTodoUpdated={handleTodoUpdated}
        onTodoDeleted={handleTodoDeleted}
      />
    </div>
  );
};

export default TodoList;

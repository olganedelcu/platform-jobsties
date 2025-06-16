
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_date?: string;
}

interface TodoColumnType {
  id: string;
  title: string;
  todos: TodoItem[];
}

export const useMenteeTaskBoardData = (userId: string) => {
  const { toast } = useToast();
  const [columns, setColumns] = useState<TodoColumnType[]>([
    {
      id: '1',
      title: 'Pending',
      todos: []
    },
    {
      id: '2',
      title: 'In Progress',
      todos: []
    },
    {
      id: '3',
      title: 'Done',
      todos: []
    }
  ]);

  useEffect(() => {
    fetchMenteeTodos();
  }, [userId]);

  const fetchMenteeTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('mentee_todos')
        .select('*')
        .eq('mentee_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match TodoItem interface with proper type casting
      const transformedTodos: TodoItem[] = (data || []).map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || undefined,
        status: todo.status as 'pending' | 'in_progress' | 'completed',
        priority: todo.priority as 'low' | 'medium' | 'high',
        due_date: todo.due_date || undefined,
        assigned_date: todo.created_at || undefined
      }));

      // Organize todos by status
      const todosByStatus = {
        pending: transformedTodos.filter(todo => todo.status === 'pending'),
        in_progress: transformedTodos.filter(todo => todo.status === 'in_progress'),
        completed: transformedTodos.filter(todo => todo.status === 'completed')
      };

      setColumns([
        {
          id: '1',
          title: 'Pending',
          todos: todosByStatus.pending
        },
        {
          id: '2',
          title: 'In Progress',
          todos: todosByStatus.in_progress
        },
        {
          id: '3',
          title: 'Done',
          todos: todosByStatus.completed
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch your tasks",
        variant: "destructive"
      });
    }
  };

  return {
    columns,
    setColumns,
    refetchTodos: fetchMenteeTodos
  };
};

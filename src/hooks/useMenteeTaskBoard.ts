
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

export const useMenteeTaskBoard = (userId: string) => {
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

  const addColumn = (title: string) => {
    const newColumn: TodoColumnType = {
      id: Date.now().toString(),
      title,
      todos: []
    };
    setColumns([...columns, newColumn]);
  };

  const addTodoToColumn = async (columnId: string, todo: Omit<TodoItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('mentee_todos')
        .insert({
          mentee_id: userId,
          title: todo.title,
          description: todo.description,
          status: todo.status,
          priority: todo.priority,
          due_date: todo.due_date,
          assigned_date: todo.assigned_date
        })
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data to match TodoItem interface
      const transformedTodo: TodoItem = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as 'pending' | 'in_progress' | 'completed',
        priority: data.priority as 'low' | 'medium' | 'high',
        due_date: data.due_date || undefined,
        assigned_date: data.created_at || undefined
      };

      setColumns(columns.map(column =>
        column.id === columnId
          ? { ...column, todos: [...column.todos, transformedTodo] }
          : column
      ));

      toast({
        title: "Success",
        description: "Task added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    }
  };

  const updateTodo = async (columnId: string, todoId: string, updates: Partial<TodoItem>) => {
    try {
      const { error } = await supabase
        .from('mentee_todos')
        .update(updates)
        .eq('id', todoId);

      if (error) throw error;

      setColumns(columns.map(column =>
        column.id === columnId
          ? {
              ...column,
              todos: column.todos.map(todo =>
                todo.id === todoId ? { ...todo, ...updates } : todo
              )
            }
          : column
      ));

      toast({
        title: "Success",
        description: "Task updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (columnId: string, todoId: string) => {
    try {
      const { error } = await supabase
        .from('mentee_todos')
        .delete()
        .eq('id', todoId);

      if (error) throw error;

      setColumns(columns.map(column =>
        column.id === columnId
          ? { ...column, todos: column.todos.filter(todo => todo.id !== todoId) }
          : column
      ));

      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const moveTodo = async (fromColumnId: string, toColumnId: string, todoId: string) => {
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const todo = fromColumn?.todos.find(t => t.id === todoId);
    
    if (!todo) return;

    // Update todo status based on the destination column
    let newStatus: 'pending' | 'in_progress' | 'completed' = todo.status;
    const toColumn = columns.find(col => col.id === toColumnId);
    if (toColumn) {
      if (toColumn.title === 'Pending') newStatus = 'pending';
      else if (toColumn.title === 'In Progress') newStatus = 'in_progress';  
      else if (toColumn.title === 'Done') newStatus = 'completed';
    }

    try {
      const { error } = await supabase
        .from('mentee_todos')
        .update({ status: newStatus })
        .eq('id', todoId);

      if (error) throw error;

      const updatedTodo = { ...todo, status: newStatus };

      setColumns(columns.map(column => {
        if (column.id === fromColumnId) {
          return { ...column, todos: column.todos.filter(t => t.id !== todoId) };
        }
        if (column.id === toColumnId) {
          return { ...column, todos: [...column.todos, updatedTodo] };
        }
        return column;
      }));

      toast({
        title: "Success",
        description: "Task moved successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to move task",
        variant: "destructive"
      });
    }
  };

  return {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  };
};

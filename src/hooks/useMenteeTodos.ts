
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchMenteeTodos, 
  createMenteeTodo, 
  updateMenteeTodoStatus, 
  deleteMenteeTodo,
  MenteeTodo 
} from '@/services/menteeTodosService';
import { supabase } from '@/integrations/supabase/client';

export const useMenteeTodos = (userId: string) => {
  const [todos, setTodos] = useState<MenteeTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchMenteeTodos(userId);
      setTodos(data);
    } catch (error: any) {
      console.error('Error loading todos:', error);
      toast({
        title: "Error",
        description: "Failed to load your tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadTodos();
    }
  }, [userId]);

  const addTodo = async (todoData: Omit<MenteeTodo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTodo = await createMenteeTodo({
        ...todoData,
        mentee_id: userId
      });
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      toast({
        title: "Success",
        description: "Task added successfully"
      });
    } catch (error: any) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (todoId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      await updateMenteeTodoStatus(todoId, status);
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === todoId ? { ...todo, status } : todo
        )
      );
      toast({
        title: "Success",
        description: "Task status updated"
      });
    } catch (error: any) {
      console.error('Error updating todo status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  const updateTodo = async (todoId: string, updates: Partial<MenteeTodo>) => {
    try {
      const { error } = await supabase
        .from('mentee_todos')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          due_date: updates.due_date
        })
        .eq('id', todoId);

      if (error) throw error;

      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === todoId ? { ...todo, ...updates } : todo
        )
      );
      
      toast({
        title: "Success",
        description: "Task updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await deleteMenteeTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  return {
    todos,
    loading,
    addTodo,
    updateStatus,
    updateTodo,
    deleteTodo,
    refetch: loadTodos
  };
};

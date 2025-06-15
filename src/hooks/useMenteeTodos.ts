
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchMenteeTodos, 
  createMenteeTodo, 
  updateMenteeTodoStatus, 
  deleteMenteeTodo,
  MenteeTodo 
} from '@/services/menteeTodosService';

export const useMenteeTodos = (menteeId: string) => {
  const [todos, setTodos] = useState<MenteeTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchMenteeTodos(menteeId);
      setTodos(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch your todos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData: Omit<MenteeTodo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTodo = await createMenteeTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      toast({
        title: "Success",
        description: "Todo added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (todoId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      await updateMenteeTodoStatus(todoId, status);
      setTodos(prev => 
        prev.map(todo => 
          todo.id === todoId 
            ? { ...todo, status }
            : todo
        )
      );
      toast({
        title: "Success",
        description: "Todo status updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update todo status",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await deleteMenteeTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      toast({
        title: "Success",
        description: "Todo deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (menteeId) {
      loadTodos();
    }
  }, [menteeId]);

  return {
    todos,
    loading,
    addTodo,
    updateStatus,
    deleteTodo,
    refreshTodos: loadTodos
  };
};

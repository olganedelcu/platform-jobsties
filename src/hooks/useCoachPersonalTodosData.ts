
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TodoColumnType, TodoItem } from '@/types/assignmentBoard';
import { coachPersonalTodosService } from '@/services/coachPersonalTodosService';
import { transformCoachTodosToTodoItems, organizeTodosByStatus } from '@/utils/coachTodosTransformers';

export const useCoachPersonalTodosData = (coachId: string) => {
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
      title: 'Completed',
      todos: []
    }
  ]);

  const fetchTodos = async () => {
    try {
      const data = await coachPersonalTodosService.fetchPersonalTodos(coachId);
      const transformedTodos = transformCoachTodosToTodoItems(data);
      const todosByStatus = organizeTodosByStatus(transformedTodos);

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
          title: 'Completed',
          todos: todosByStatus.completed
        }
      ]);
    } catch (error: unknown) {
      console.error('Error fetching personal todos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch personal todos",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (coachId) {
      fetchTodos();
    }
  }, [coachId]);

  return {
    columns,
    setColumns,
    refreshTodos: fetchTodos,
    toast
  };
};

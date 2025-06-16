
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TodoColumnType, TodoItem } from '@/types/assignmentBoard';

export const useCoachAssignmentsBoard = (coachId: string) => {
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

  const fetchAssignedTodos = async () => {
    try {
      console.log('Fetching coach assigned todos for coach:', coachId);
      
      // Fetch todos assigned by this coach to mentees (excluding personal todos)
      const { data, error } = await supabase
        .from('coach_todos')
        .select(`
          *,
          profiles!coach_todos_mentee_id_fkey(
            first_name,
            last_name,
            email
          )
        `)
        .eq('coach_id', coachId)
        .neq('mentee_id', coachId) // Exclude personal todos where mentee_id equals coach_id
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Coach assigned todos data:', data);

      // Transform coach todos to TodoItem format and include mentee info
      const transformedTodos: TodoItem[] = (data || []).map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || undefined,
        status: todo.status as 'pending' | 'in_progress' | 'completed',
        priority: todo.priority as 'low' | 'medium' | 'high',
        due_date: todo.due_date || undefined,
        assigned_date: todo.created_at,
        assignedTo: todo.profiles ? `${todo.profiles.first_name} ${todo.profiles.last_name}` : 'Unknown'
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
          title: 'Completed',
          todos: todosByStatus.completed
        }
      ]);
    } catch (error: any) {
      console.error('Error fetching coach assigned todos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assigned todos",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (coachId) {
      fetchAssignedTodos();
    }
  }, [coachId]);

  const addColumn = (title: string) => {
    const newColumn: TodoColumnType = {
      id: Date.now().toString(),
      title,
      todos: []
    };
    setColumns([...columns, newColumn]);
  };

  const addTodoToColumn = async (columnId: string, todo: Omit<TodoItem, 'id'>) => {
    // For assignments board, we don't allow creating new todos directly
    toast({
      title: "Info",
      description: "Use 'Send to Mentees' to assign new tasks",
      variant: "default"
    });
  };

  const updateTodo = async (columnId: string, todoId: string, updates: Partial<TodoItem>) => {
    try {
      const { error } = await supabase
        .from('coach_todos')
        .update({
          title: updates.title,
          description: updates.description || null,
          status: updates.status,
          priority: updates.priority,
          due_date: updates.due_date || null
        })
        .eq('id', todoId);

      if (error) throw error;

      setColumns(prevColumns =>
        prevColumns.map(column =>
          column.id === columnId
            ? {
                ...column,
                todos: column.todos.map(todo =>
                  todo.id === todoId ? { ...todo, ...updates } : todo
                )
              }
            : column
        )
      );

      toast({
        title: "Success",
        description: "Assignment updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating assigned todo:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (columnId: string, todoId: string) => {
    try {
      const { error } = await supabase
        .from('coach_todos')
        .delete()
        .eq('id', todoId);

      if (error) throw error;

      setColumns(prevColumns =>
        prevColumns.map(column =>
          column.id === columnId
            ? { ...column, todos: column.todos.filter(todo => todo.id !== todoId) }
            : column
        )
      );

      toast({
        title: "Success",
        description: "Assignment deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting assigned todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete assignment",
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
      else if (toColumn.title === 'Completed') newStatus = 'completed';
    }

    try {
      const { error } = await supabase
        .from('coach_todos')
        .update({ status: newStatus })
        .eq('id', todoId);

      if (error) throw error;

      const updatedTodo = { ...todo, status: newStatus };

      setColumns(prevColumns => prevColumns.map(column => {
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
        description: "Assignment moved successfully"
      });
    } catch (error: any) {
      console.error('Error moving assigned todo:', error);
      toast({
        title: "Error",
        description: "Failed to move assignment",
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
    moveTodo,
    refreshAssignments: fetchAssignedTodos
  };
};

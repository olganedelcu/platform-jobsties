
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { TodoItem, TodoColumnType } from '@/types/assignmentBoard';

export const useAssignmentBoard = (coachId: string) => {
  const { toast } = useToast();
  const { assignments, updateStatus } = useTodoAssignments(coachId, false);
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

  useEffect(() => {
    // Transform assignments to TodoItem format
    const transformedTodos: TodoItem[] = assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.todo?.title || 'Untitled Task',
      description: assignment.todo?.description || undefined,
      status: assignment.status,
      priority: assignment.todo?.priority || 'medium',
      due_date: assignment.todo?.due_date || undefined,
      assigned_date: assignment.assigned_at || undefined
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
  }, [assignments]);

  const addColumn = (title: string) => {
    const newColumn: TodoColumnType = {
      id: Date.now().toString(),
      title,
      todos: []
    };
    setColumns([...columns, newColumn]);
  };

  const addTodoToColumn = async (columnId: string, todo: Omit<TodoItem, 'id'>) => {
    // Mentees cannot create new assignments
    toast({
      title: "Info",
      description: "You can only work on tasks assigned by your coach",
      variant: "default"
    });
  };

  const updateTodo = async (columnId: string, todoId: string, updates: Partial<TodoItem>) => {
    try {
      if (updates.status) {
        await updateStatus(todoId, updates.status);
        
        // Update local state to reflect the change immediately
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
          description: "Task status updated successfully"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (columnId: string, todoId: string) => {
    // Mentees cannot delete assignments
    toast({
      title: "Info",
      description: "You cannot delete assignments from your coach",
      variant: "default"
    });
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
      await updateStatus(todoId, newStatus);
      
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

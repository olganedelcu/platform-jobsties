
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { TodoItem, TodoColumnType } from '@/types/assignmentBoard';

export const useAssignmentBoard = (coachId: string) => {
  const { toast } = useToast();
  const { assignments, updateStatus, updateDetails } = useTodoAssignments(coachId, false);
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
    // Transform assignments to TodoItem format, using mentee edits when available
    const transformedTodos: TodoItem[] = assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.mentee_title || assignment.todo?.title || 'Untitled Task',
      description: assignment.mentee_description || assignment.todo?.description || undefined,
      status: assignment.status,
      priority: assignment.mentee_priority || assignment.todo?.priority || 'medium',
      due_date: assignment.mentee_due_date || assignment.todo?.due_date || undefined,
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
      } else {
        // Handle other updates (title, description, priority, due_date)
        const detailUpdates: any = {};
        if (updates.title !== undefined) detailUpdates.mentee_title = updates.title;
        if (updates.description !== undefined) detailUpdates.mentee_description = updates.description;
        if (updates.priority !== undefined) detailUpdates.mentee_priority = updates.priority;
        if (updates.due_date !== undefined) detailUpdates.mentee_due_date = updates.due_date;
        
        if (Object.keys(detailUpdates).length > 0) {
          await updateDetails(todoId, detailUpdates);
        }
      }
      
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
    // Mentees cannot delete assignments
    toast({
      title: "Info",
      description: "You cannot delete assignments from your coach",
      variant: "default"
    });
  };

  const moveTodo = async (todoId: string, fromColumnId: string, toColumnId: string) => {
    console.log('Moving assignment:', { todoId, fromColumnId, toColumnId });
    
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const toColumn = columns.find(col => col.id === toColumnId);
    const todo = fromColumn?.todos.find(t => t.id === todoId);
    
    if (!todo || !toColumn) {
      console.error('Assignment or target column not found');
      return;
    }

    // Determine new status based on the destination column title
    let newStatus: 'pending' | 'in_progress' | 'completed' = todo.status;
    const columnTitle = toColumn.title.toLowerCase();
    
    if (columnTitle.includes('pending')) {
      newStatus = 'pending';
    } else if (columnTitle.includes('progress')) {
      newStatus = 'in_progress';
    } else if (columnTitle.includes('completed') || columnTitle.includes('done')) {
      newStatus = 'completed';
    }

    console.log('New assignment status:', newStatus);

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
      console.error('Error moving assignment:', error);
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

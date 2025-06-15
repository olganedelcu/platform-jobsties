
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import TodoColumn from '@/components/todos/TodoColumn';
import AddColumnDialog from '@/components/todos/AddColumnDialog';

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

interface CoachAssignmentsBoardProps {
  coachId: string;
}

const CoachAssignmentsBoard = ({ coachId }: CoachAssignmentsBoardProps) => {
  const { toast } = useToast();
  const { assignments, updateStatus } = useTodoAssignments(coachId, true);
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

  const [showAddColumn, setShowAddColumn] = useState(false);

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
    setShowAddColumn(false);
  };

  const addTodoToColumn = async (columnId: string, todo: Omit<TodoItem, 'id'>) => {
    // This functionality would need to be implemented for creating new assignments
    // For now, we'll just show a message that this is view-only
    toast({
      title: "Info",
      description: "Assignment creation from board view is not yet implemented",
      variant: "default"
    });
  };

  const updateTodo = async (columnId: string, todoId: string, updates: Partial<TodoItem>) => {
    try {
      if (updates.status) {
        await updateStatus(todoId, updates.status);
        
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
      }
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (columnId: string, todoId: string) => {
    // Assignments typically shouldn't be deleted, just show info
    toast({
      title: "Info",
      description: "Assignments cannot be deleted from this view",
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

      setColumns(columns.map(column => {
        if (column.id === fromColumnId) {
          return { ...column, todos: column.todos.filter(t => t.id !== todoId) };
        }
        if (column.id === toColumnId) {
          return { ...column, todos: [...column.todos, updatedTodo] };
        }
        return column;
      }));
    } catch (error: any) {
      console.error('Error moving assignment:', error);
      toast({
        title: "Error",
        description: "Failed to move assignment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <TodoColumn
            key={column.id}
            column={column}
            onAddTodo={(todo) => addTodoToColumn(column.id, todo)}
            onUpdateTodo={(todoId, updates) => updateTodo(column.id, todoId, updates)}
            onDeleteTodo={(todoId) => deleteTodo(column.id, todoId)}
            onMoveTodo={moveTodo}
            allColumns={columns}
          />
        ))}
        
        <Card className="min-w-80 bg-gray-50">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              onClick={() => setShowAddColumn(true)}
              className="w-full justify-start text-gray-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another list
            </Button>
          </CardContent>
        </Card>
      </div>

      <AddColumnDialog
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={addColumn}
      />
    </div>
  );
};

export default CoachAssignmentsBoard;

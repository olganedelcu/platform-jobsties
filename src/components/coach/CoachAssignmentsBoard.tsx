
import React, { useState } from 'react';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import AssignmentBoardHeader from './AssignmentBoardHeader';
import AssignmentColumnGrid from './AssignmentColumnGrid';
import AddColumnDialog from '@/components/todos/AddColumnDialog';
import { CoachAssignmentsBoardProps } from '@/types/assignmentBoard';
import { TodoColumnType, TodoItem } from '@/types/assignmentBoard';
import { useToast } from '@/hooks/use-toast';

const CoachAssignmentsBoard = ({ coachId }: CoachAssignmentsBoardProps) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [columns, setColumns] = useState<TodoColumnType[]>([
    { id: '1', title: 'Pending', todos: [] },
    { id: '2', title: 'In Progress', todos: [] },
    { id: '3', title: 'Completed', todos: [] }
  ]);
  
  const { toast } = useToast();
  const { assignments, loading, updateStatus } = useTodoAssignments(coachId, false);

  // Transform assignments to TodoItems and organize by status
  React.useEffect(() => {
    if (!loading && assignments) {
      const transformedTodos: TodoItem[] = assignments.map(assignment => ({
        id: assignment.id,
        title: assignment.mentee_title || assignment.todo?.title || 'Untitled Task',
        description: assignment.mentee_description || assignment.todo?.description || undefined,
        status: assignment.status as 'pending' | 'in_progress' | 'completed',
        priority: (assignment.mentee_priority || assignment.todo?.priority || 'medium') as 'low' | 'medium' | 'high',
        due_date: assignment.mentee_due_date || assignment.todo?.due_date || undefined,
        assigned_date: assignment.assigned_at
      }));

      // Organize todos by status
      const todosByStatus = {
        pending: transformedTodos.filter(todo => todo.status === 'pending'),
        in_progress: transformedTodos.filter(todo => todo.status === 'in_progress'),
        completed: transformedTodos.filter(todo => todo.status === 'completed')
      };

      setColumns([
        { id: '1', title: 'Pending', todos: todosByStatus.pending },
        { id: '2', title: 'In Progress', todos: todosByStatus.in_progress },
        { id: '3', title: 'Completed', todos: todosByStatus.completed }
      ]);
    }
  }, [assignments, loading]);

  const addColumn = (title: string) => {
    const newColumn: TodoColumnType = {
      id: Date.now().toString(),
      title,
      todos: []
    };
    setColumns([...columns, newColumn]);
  };

  const addTodoToColumn = async (columnId: string, todo: Omit<TodoItem, 'id'>) => {
    toast({
      title: "Info",
      description: "You cannot create new assignments here. Assignments are created by coaches.",
      variant: "default"
    });
  };

  const updateTodo = async (columnId: string, todoId: string, updates: Partial<TodoItem>) => {
    // This would update the assignment details
    toast({
      title: "Info",
      description: "Assignment updates will be available soon",
      variant: "default"
    });
  };

  const deleteTodo = async (columnId: string, todoId: string) => {
    toast({
      title: "Info",
      description: "You cannot delete assignments. Contact your coach if needed.",
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
        description: "Assignment status updated successfully"
      });
    } catch (error: any) {
      console.error('Error moving assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive"
      });
    }
  };

  const handleAddColumn = (title: string) => {
    addColumn(title);
    setShowAddColumn(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AssignmentBoardHeader
        title="Coach Assigned Tasks"
        description="Track and manage tasks assigned by your coach"
        onAddColumn={() => setShowAddColumn(true)}
      />

      <AssignmentColumnGrid
        columns={columns}
        onAddTodo={addTodoToColumn}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        onMoveTodo={moveTodo}
        onShowAddColumn={() => setShowAddColumn(true)}
        showCoachAssignedLabel={true}
      />

      <AddColumnDialog
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={handleAddColumn}
      />
    </div>
  );
};

export default CoachAssignmentsBoard;

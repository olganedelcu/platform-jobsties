
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

export const useMenteeTaskBoardActions = (
  userId: string,
  columns: TodoColumnType[],
  setColumns: React.Dispatch<React.SetStateAction<TodoColumnType[]>>
) => {
  const { toast } = useToast();

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

  const moveTodo = async (todoId: string, fromColumnId: string, toColumnId: string) => {
    console.log('Moving todo:', { todoId, fromColumnId, toColumnId });
    
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const toColumn = columns.find(col => col.id === toColumnId);
    const todo = fromColumn?.todos.find(t => t.id === todoId);
    
    if (!todo || !toColumn) {
      console.error('Todo or target column not found');
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

    console.log('New status determined:', newStatus);

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
      console.error('Error moving task:', error);
      toast({
        title: "Error",
        description: "Failed to move task",
        variant: "destructive"
      });
    }
  };

  return {
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  };
};

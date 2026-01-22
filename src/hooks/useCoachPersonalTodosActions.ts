
import { TodoColumnType, TodoItem } from '@/types/assignmentBoard';
import { coachPersonalTodosService } from '@/services/coachPersonalTodosService';
import { mapColumnTitleToStatus } from '@/utils/coachTodosTransformers';

interface ToastFunction {
  (props: { title: string; description: string; variant?: 'default' | 'destructive' }): void;
}

export const useCoachPersonalTodosActions = (
  coachId: string,
  columns: TodoColumnType[],
  setColumns: React.Dispatch<React.SetStateAction<TodoColumnType[]>>,
  toast: ToastFunction
) => {
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
      const data = await coachPersonalTodosService.createTodo(coachId, {
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        due_date: todo.due_date
      });

      const newTodo: TodoItem = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as 'pending' | 'in_progress' | 'completed',
        priority: data.priority as 'low' | 'medium' | 'high',
        due_date: data.due_date || undefined,
        assigned_date: data.created_at
      };

      setColumns(prevColumns =>
        prevColumns.map(column =>
          column.id === columnId
            ? { ...column, todos: [...column.todos, newTodo] }
            : column
        )
      );

      toast({
        title: "Success",
        description: "Todo added successfully"
      });
    } catch (error: unknown) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive"
      });
    }
  };

  const updateTodo = async (columnId: string, todoId: string, updates: Partial<TodoItem>) => {
    try {
      await coachPersonalTodosService.updateTodo(todoId, {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        due_date: updates.due_date
      });

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
        description: "Todo updated successfully"
      });
    } catch (error: unknown) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (columnId: string, todoId: string) => {
    try {
      await coachPersonalTodosService.deleteTodo(todoId);

      setColumns(prevColumns =>
        prevColumns.map(column =>
          column.id === columnId
            ? { ...column, todos: column.todos.filter(todo => todo.id !== todoId) }
            : column
        )
      );

      toast({
        title: "Success",
        description: "Todo deleted successfully"
      });
    } catch (error: unknown) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive"
      });
    }
  };

  const moveTodo = async (fromColumnId: string, toColumnId: string, todoId: string) => {
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const todo = fromColumn?.todos.find(t => t.id === todoId);
    
    if (!todo) return;

    const toColumn = columns.find(col => col.id === toColumnId);
    if (!toColumn) return;

    const newStatus = mapColumnTitleToStatus(toColumn.title);

    try {
      await coachPersonalTodosService.updateTodo(todoId, { status: newStatus });

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
        description: "Todo moved successfully"
      });
    } catch (error: unknown) {
      console.error('Error moving todo:', error);
      toast({
        title: "Error",
        description: "Failed to move todo",
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

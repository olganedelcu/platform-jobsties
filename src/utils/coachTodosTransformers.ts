
import { TodoItem } from '@/types/assignmentBoard';
import { CoachTodo } from '@/services/coachPersonalTodosService';

export const transformCoachTodosToTodoItems = (todos: CoachTodo[]): TodoItem[] => {
  return todos.map(todo => ({
    id: todo.id,
    title: todo.title,
    description: todo.description || undefined,
    status: todo.status as 'pending' | 'in_progress' | 'completed',
    priority: todo.priority as 'low' | 'medium' | 'high',
    due_date: todo.due_date || undefined,
    assigned_date: todo.created_at
  }));
};

export const organizeTodosByStatus = (todos: TodoItem[]) => {
  return {
    pending: todos.filter(todo => todo.status === 'pending'),
    in_progress: todos.filter(todo => todo.status === 'in_progress'),
    completed: todos.filter(todo => todo.status === 'completed')
  };
};

export const mapStatusToColumnTitle = (status: 'pending' | 'in_progress' | 'completed'): string => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return 'Pending';
  }
};

export const mapColumnTitleToStatus = (title: string): 'pending' | 'in_progress' | 'completed' => {
  switch (title) {
    case 'Pending': return 'pending';
    case 'In Progress': return 'in_progress';
    case 'Completed': return 'completed';
    default: return 'pending';
  }
};

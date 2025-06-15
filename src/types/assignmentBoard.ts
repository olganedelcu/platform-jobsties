
export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_date?: string;
}

export interface TodoColumnType {
  id: string;
  title: string;
  todos: TodoItem[];
}

export interface CoachAssignmentsBoardProps {
  coachId: string;
}

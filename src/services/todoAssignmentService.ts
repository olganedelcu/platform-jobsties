
import { supabase } from '@/integrations/supabase/client';

export interface TodoAssignment {
  id: string;
  coach_id: string;
  mentee_id: string;
  todo_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoAssignmentWithDetails extends TodoAssignment {
  todo?: {
    title: string;
    description: string | null;
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
  };
  mentee?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const fetchTodoAssignments = async (userId: string, isCoach: boolean = false): Promise<TodoAssignmentWithDetails[]> => {
  let query = supabase
    .from('mentee_todo_assignments')
    .select(`
      *,
      coach_todos!inner(title, description, priority, due_date),
      profiles!mentee_id(first_name, last_name, email)
    `)
    .order('created_at', { ascending: false });

  if (isCoach) {
    query = query.eq('coach_id', userId);
  } else {
    query = query.eq('mentee_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    todo: item.coach_todos,
    mentee: item.profiles
  }));
};

export const updateAssignmentStatus = async (
  assignmentId: string, 
  status: 'pending' | 'in_progress' | 'completed'
): Promise<void> => {
  const { error } = await supabase
    .from('mentee_todo_assignments')
    .update({ status })
    .eq('id', assignmentId);

  if (error) {
    throw error;
  }
};

export const createTodoAssignments = async (
  coachId: string,
  todoId: string,
  menteeIds: string[]
): Promise<void> => {
  const assignments = menteeIds.map(menteeId => ({
    coach_id: coachId,
    mentee_id: menteeId,
    todo_id: todoId
  }));

  const { error } = await supabase
    .from('mentee_todo_assignments')
    .insert(assignments);

  if (error) {
    throw error;
  }
};

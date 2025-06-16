
import { supabase } from '@/integrations/supabase/client';

export interface CoachTodo {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  mentee_id: string;
  created_at: string;
  updated_at: string;
}

export const coachPersonalTodosService = {
  fetchPersonalTodos: async (coachId: string): Promise<CoachTodo[]> => {
    console.log('Fetching personal todos for coach:', coachId);
    
    const { data, error } = await supabase
      .from('coach_todos')
      .select('*')
      .eq('coach_id', coachId)
      .eq('mentee_id', coachId) // Only personal todos, not assignments to mentees
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('Personal todos data:', data);
    
    // Type assert the data to match our CoachTodo interface
    return (data || []) as CoachTodo[];
  },

  createTodo: async (coachId: string, todo: {
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
  }) => {
    const { data, error } = await supabase
      .from('coach_todos')
      .insert({
        coach_id: coachId,
        mentee_id: coachId, // Personal todo, using coach_id as mentee_id
        title: todo.title,
        description: todo.description || null,
        status: todo.status,
        priority: todo.priority,
        due_date: todo.due_date || null
      })
      .select()
      .single();

    if (error) throw error;
    return data as CoachTodo;
  },

  updateTodo: async (todoId: string, updates: {
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
  }) => {
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
  },

  deleteTodo: async (todoId: string) => {
    const { error } = await supabase
      .from('coach_todos')
      .delete()
      .eq('id', todoId);

    if (error) throw error;
  }
};

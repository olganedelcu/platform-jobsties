
import { supabase } from '@/integrations/supabase/client';

export interface MenteeTodo {
  id: string;
  mentee_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchMenteeTodos = async (menteeId: string): Promise<MenteeTodo[]> => {
  const { data, error } = await supabase
    .from('mentee_todos')
    .select('*')
    .eq('mentee_id', menteeId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    status: item.status as 'pending' | 'in_progress' | 'completed',
    priority: item.priority as 'low' | 'medium' | 'high'
  }));
};

export const createMenteeTodo = async (todo: Omit<MenteeTodo, 'id' | 'created_at' | 'updated_at'>): Promise<MenteeTodo> => {
  const { data, error } = await supabase
    .from('mentee_todos')
    .insert(todo)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    status: data.status as 'pending' | 'in_progress' | 'completed',
    priority: data.priority as 'low' | 'medium' | 'high'
  };
};

export const updateMenteeTodoStatus = async (todoId: string, status: 'pending' | 'in_progress' | 'completed'): Promise<void> => {
  const { error } = await supabase
    .from('mentee_todos')
    .update({ status })
    .eq('id', todoId);

  if (error) {
    throw error;
  }
};

export const deleteMenteeTodo = async (todoId: string): Promise<void> => {
  const { error } = await supabase
    .from('mentee_todos')
    .delete()
    .eq('id', todoId);

  if (error) {
    throw error;
  }
};

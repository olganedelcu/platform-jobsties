
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
  console.log('=== FETCHING TODO ASSIGNMENTS ===');
  console.log('User ID:', userId);
  console.log('Is Coach:', isCoach);
  
  // Check authentication first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('Current authenticated user:', user?.id);
  
  if (authError || !user) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }

  // Build the query based on user role
  let query = supabase
    .from('mentee_todo_assignments')
    .select(`
      *,
      coach_todos!inner(
        id,
        title,
        description,
        priority,
        due_date
      ),
      profiles!mentee_id(
        first_name,
        last_name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (isCoach) {
    query = query.eq('coach_id', userId);
    console.log('Filtering by coach_id:', userId);
  } else {
    query = query.eq('mentee_id', userId);
    console.log('Filtering by mentee_id:', userId);
  }

  const { data, error } = await query;

  console.log('Query result:');
  console.log('- Data:', data);
  console.log('- Error:', error);
  console.log('- Count:', data?.length || 0);

  if (error) {
    console.error('Error fetching todo assignments:', error);
    throw error;
  }

  // Transform the data to match our interface
  const transformedData = (data || []).map(item => ({
    id: item.id,
    coach_id: item.coach_id,
    mentee_id: item.mentee_id,
    todo_id: item.todo_id,
    status: item.status as 'pending' | 'in_progress' | 'completed',
    assigned_at: item.assigned_at,
    started_at: item.started_at,
    completed_at: item.completed_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
    todo: item.coach_todos ? {
      title: item.coach_todos.title,
      description: item.coach_todos.description,
      priority: item.coach_todos.priority as 'low' | 'medium' | 'high',
      due_date: item.coach_todos.due_date
    } : undefined,
    mentee: item.profiles ? {
      first_name: item.profiles.first_name,
      last_name: item.profiles.last_name,
      email: item.profiles.email
    } : undefined
  }));

  console.log('Transformed assignments data:', transformedData);
  console.log('=== END FETCH ===');
  return transformedData;
};

export const updateAssignmentStatus = async (
  assignmentId: string, 
  status: 'pending' | 'in_progress' | 'completed'
): Promise<void> => {
  const updateData: any = { status };
  
  // Set timestamps based on status
  if (status === 'in_progress') {
    updateData.started_at = new Date().toISOString();
  } else if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
    // Ensure started_at is set if not already
    const { data: current } = await supabase
      .from('mentee_todo_assignments')
      .select('started_at')
      .eq('id', assignmentId)
      .single();
    
    if (!current?.started_at) {
      updateData.started_at = new Date().toISOString();
    }
  } else if (status === 'pending') {
    updateData.started_at = null;
    updateData.completed_at = null;
  }

  const { error } = await supabase
    .from('mentee_todo_assignments')
    .update(updateData)
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
  console.log('=== CREATING TODO ASSIGNMENTS ===');
  console.log('Coach ID:', coachId);
  console.log('Todo ID:', todoId);
  console.log('Mentee IDs:', menteeIds);

  const assignments = menteeIds.map(menteeId => ({
    coach_id: coachId,
    mentee_id: menteeId,
    todo_id: todoId,
    status: 'pending'
  }));

  console.log('Assignments to create:', assignments);

  const { data, error } = await supabase
    .from('mentee_todo_assignments')
    .insert(assignments)
    .select();

  console.log('Create result:');
  console.log('- Data:', data);
  console.log('- Error:', error);
  console.log('=== END CREATE ===');

  if (error) {
    console.error('Error creating assignments:', error);
    throw error;
  }
};


-- First, let's drop the existing policies to start fresh
DROP POLICY IF EXISTS "Coaches can manage their todo assignments" ON public.mentee_todo_assignments;
DROP POLICY IF EXISTS "Mentees can view and update their assignments" ON public.mentee_todo_assignments;

-- Create more specific policies for better access control
CREATE POLICY "Coaches can view their assignments" 
  ON public.mentee_todo_assignments 
  FOR SELECT
  USING (coach_id = auth.uid());

CREATE POLICY "Coaches can create assignments" 
  ON public.mentee_todo_assignments 
  FOR INSERT
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update their assignments" 
  ON public.mentee_todo_assignments 
  FOR UPDATE
  USING (coach_id = auth.uid());

CREATE POLICY "Coaches can delete their assignments" 
  ON public.mentee_todo_assignments 
  FOR DELETE
  USING (coach_id = auth.uid());

CREATE POLICY "Mentees can view their assignments" 
  ON public.mentee_todo_assignments 
  FOR SELECT
  USING (mentee_id = auth.uid());

CREATE POLICY "Mentees can update their assignment status" 
  ON public.mentee_todo_assignments 
  FOR UPDATE
  USING (mentee_id = auth.uid());

-- Also ensure the related coach_todos table has proper policies for the JOIN
DROP POLICY IF EXISTS "Enable read access for all users" ON public.coach_todos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.coach_todos;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.coach_todos;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.coach_todos;

-- Create proper RLS policies for coach_todos table
CREATE POLICY "Coaches can manage their todos" 
  ON public.coach_todos 
  FOR ALL
  USING (coach_id = auth.uid());

-- Allow mentees to read todos that are assigned to them (needed for the JOIN in fetchTodoAssignments)
CREATE POLICY "Mentees can view assigned todos" 
  ON public.coach_todos 
  FOR SELECT
  USING (
    id IN (
      SELECT todo_id 
      FROM public.mentee_todo_assignments 
      WHERE mentee_id = auth.uid()
    )
  );

-- Make sure RLS is enabled on both tables
ALTER TABLE public.mentee_todo_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_todos ENABLE ROW LEVEL SECURITY;

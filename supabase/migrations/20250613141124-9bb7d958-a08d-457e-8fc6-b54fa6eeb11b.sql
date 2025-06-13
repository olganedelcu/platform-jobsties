
-- Check and fix RLS policies for mentee_todo_assignments table
-- First, let's ensure the foreign key constraints are properly set up
ALTER TABLE public.mentee_todo_assignments 
DROP CONSTRAINT IF EXISTS fk_mentee_todo_assignments_coach_id;

ALTER TABLE public.mentee_todo_assignments 
DROP CONSTRAINT IF EXISTS fk_mentee_todo_assignments_mentee_id;

-- Add the foreign key constraints properly
ALTER TABLE public.mentee_todo_assignments 
ADD CONSTRAINT fk_mentee_todo_assignments_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.mentee_todo_assignments 
ADD CONSTRAINT fk_mentee_todo_assignments_mentee_id 
FOREIGN KEY (mentee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Coaches can view their todo assignments" ON public.mentee_todo_assignments;
DROP POLICY IF EXISTS "Coaches can create todo assignments" ON public.mentee_todo_assignments;
DROP POLICY IF EXISTS "Coaches can update their todo assignments" ON public.mentee_todo_assignments;
DROP POLICY IF EXISTS "Mentees can view their todo assignments" ON public.mentee_todo_assignments;
DROP POLICY IF EXISTS "Mentees can update their todo assignment status" ON public.mentee_todo_assignments;

-- Create comprehensive RLS policies
CREATE POLICY "Coaches can manage their todo assignments" 
  ON public.mentee_todo_assignments 
  FOR ALL
  USING (coach_id = auth.uid());

CREATE POLICY "Mentees can view and update their assignments" 
  ON public.mentee_todo_assignments 
  FOR ALL
  USING (mentee_id = auth.uid());

-- Make sure RLS is enabled
ALTER TABLE public.mentee_todo_assignments ENABLE ROW LEVEL SECURITY;


-- Add columns to mentee_todo_assignments to store mentee edits
ALTER TABLE public.mentee_todo_assignments 
ADD COLUMN mentee_title text,
ADD COLUMN mentee_description text,
ADD COLUMN mentee_due_date date,
ADD COLUMN mentee_priority text CHECK (mentee_priority IN ('low', 'medium', 'high'));

-- Update the RLS policy to allow mentees to update these new fields
DROP POLICY IF EXISTS "Mentees can update their todo assignment status" ON public.mentee_todo_assignments;

CREATE POLICY "Mentees can update their assignment details" 
  ON public.mentee_todo_assignments 
  FOR UPDATE 
  USING (mentee_id = auth.uid())
  WITH CHECK (mentee_id = auth.uid());

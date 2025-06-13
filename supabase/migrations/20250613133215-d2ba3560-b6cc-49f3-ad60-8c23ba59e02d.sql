
-- Add foreign key constraint to establish the relationship between mentee_todo_assignments and profiles
ALTER TABLE public.mentee_todo_assignments 
ADD CONSTRAINT fk_mentee_todo_assignments_mentee_id 
FOREIGN KEY (mentee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint for coach_id as well for consistency
ALTER TABLE public.mentee_todo_assignments 
ADD CONSTRAINT fk_mentee_todo_assignments_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

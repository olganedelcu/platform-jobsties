
-- Create a table to establish coach-mentee relationships
CREATE TABLE public.coach_mentee_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(coach_id, mentee_id)
);

-- Enable RLS on the coach_mentee_assignments table
ALTER TABLE public.coach_mentee_assignments ENABLE ROW LEVEL SECURITY;

-- Create policy for coaches to view their assigned mentees
CREATE POLICY "Coaches can view their assigned mentees" 
  ON public.coach_mentee_assignments 
  FOR SELECT 
  USING (auth.uid() = coach_id);

-- Create policy for coaches to assign mentees
CREATE POLICY "Coaches can assign mentees" 
  ON public.coach_mentee_assignments 
  FOR INSERT 
  WITH CHECK (auth.uid() = coach_id);

-- Create policy for coaches to update assignments
CREATE POLICY "Coaches can update their mentee assignments" 
  ON public.coach_mentee_assignments 
  FOR UPDATE 
  USING (auth.uid() = coach_id);

-- Add some sample data to establish relationships (replace with actual IDs from your database)
-- You'll need to run this separately after checking actual user IDs
-- INSERT INTO public.coach_mentee_assignments (coach_id, mentee_id) 
-- SELECT 
--   (SELECT id FROM public.profiles WHERE role = 'COACH' LIMIT 1),
--   (SELECT id FROM public.profiles WHERE role = 'MENTEE' LIMIT 1);

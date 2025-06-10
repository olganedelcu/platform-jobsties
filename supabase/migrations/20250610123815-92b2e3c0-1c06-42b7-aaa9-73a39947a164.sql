
-- Insert sample coach-mentee assignments to test the functionality
-- First, let's check what users we have and create some assignments

-- Insert assignments between existing coaches and mentees
-- Replace these IDs with actual IDs from your profiles table
INSERT INTO public.coach_mentee_assignments (coach_id, mentee_id) 
SELECT 
  c.id as coach_id,
  m.id as mentee_id
FROM 
  (SELECT id FROM public.profiles WHERE role = 'COACH' LIMIT 3) c
CROSS JOIN 
  (SELECT id FROM public.profiles WHERE role = 'MENTEE' LIMIT 5) m;

-- This will create assignments between the first 3 coaches and first 5 mentees
-- Each coach will be assigned to all 5 mentees for testing purposes

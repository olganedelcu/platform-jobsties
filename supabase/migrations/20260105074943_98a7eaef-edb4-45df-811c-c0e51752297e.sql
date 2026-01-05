-- First create the profile for the mentee if it doesn't exist
INSERT INTO public.profiles (id, first_name, last_name, email, role)
VALUES ('f8515bd2-ac4b-4ecc-9973-86fd0aea0e2b', 'Miruna', 'Nedelcu', 'miruna.ndelcu@gmail.com', 'MENTEE')
ON CONFLICT (id) DO NOTHING;

-- Then assign the mentee to all coaches
INSERT INTO public.coach_mentee_assignments (coach_id, mentee_id, is_active)
SELECT 
  p.id as coach_id,
  'f8515bd2-ac4b-4ecc-9973-86fd0aea0e2b'::uuid as mentee_id,
  true as is_active
FROM public.profiles p
WHERE p.role = 'COACH'
ON CONFLICT (coach_id, mentee_id) DO NOTHING;
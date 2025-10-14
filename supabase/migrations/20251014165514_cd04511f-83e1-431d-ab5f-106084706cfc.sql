-- Drop the old check constraint that doesn't include STUDENT
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new check constraint that includes STUDENT
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('MENTEE', 'COACH', 'STUDENT'));
-- Update RLS policies to allow STUDENT role access to mentee features
-- Part 1: Drop function with CASCADE and recreate policies

-- Drop function and its dependent policies with CASCADE
DROP FUNCTION IF EXISTS get_current_user_role() CASCADE;

-- Recreate the function with search_path set
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Recreate profiles policies that were dropped
CREATE POLICY "Coaches can view all profiles" 
ON profiles FOR SELECT 
USING (
  (auth.uid() = id) OR (get_current_user_role() = 'COACH')
);

CREATE POLICY "Coaches can delete mentees" 
ON profiles FOR DELETE 
USING (
  (get_current_user_role() = 'COACH') AND 
  ((SELECT role FROM profiles WHERE id = profiles.id) = 'MENTEE')
);

CREATE POLICY "Mentees and students can view each other" 
ON profiles FOR SELECT 
USING (
  role IN ('MENTEE', 'STUDENT') AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- First, let's create a function to automatically assign new mentees to Ana Nedelcu
CREATE OR REPLACE FUNCTION public.auto_assign_mentee_to_ana()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ana_coach_id uuid;
BEGIN
  -- Get Ana Nedelcu's user ID
  SELECT id INTO ana_coach_id 
  FROM profiles 
  WHERE email = 'ana@jobsites.com' AND role = 'coach'
  LIMIT 1;
  
  -- If Ana exists and the new user is a mentee, create the assignment
  IF ana_coach_id IS NOT NULL AND NEW.role = 'mentee' THEN
    INSERT INTO coach_mentee_assignments (coach_id, mentee_id, is_active)
    VALUES (ana_coach_id, NEW.id, true);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger that fires after a new profile is created
DROP TRIGGER IF EXISTS auto_assign_mentee_trigger ON profiles;
CREATE TRIGGER auto_assign_mentee_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_mentee_to_ana();

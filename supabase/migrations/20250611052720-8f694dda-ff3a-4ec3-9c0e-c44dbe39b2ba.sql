
-- Check current RLS policies on job_applications table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'job_applications';

-- If coaches need to be able to delete mentee applications, we need to add a policy
-- First, let's create a policy that allows coaches to delete applications of their assigned mentees
CREATE POLICY "Coaches can delete their mentees applications" 
ON public.job_applications 
FOR DELETE 
USING (
  mentee_id IN (
    SELECT mentee_id 
    FROM coach_mentee_assignments 
    WHERE coach_id = auth.uid() 
    AND is_active = true
  )
  OR
  -- Special case for ana@jobsties.com to delete any application
  EXISTS (
    SELECT 1 
    FROM auth.users 
    JOIN profiles ON auth.users.id = profiles.id 
    WHERE auth.users.id = auth.uid() 
    AND profiles.email = 'ana@jobsties.com'
  )
);

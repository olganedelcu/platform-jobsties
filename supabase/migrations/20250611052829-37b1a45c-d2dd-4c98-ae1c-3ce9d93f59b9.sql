
-- Remove the policy that allows coaches to delete applications from the database
DROP POLICY IF EXISTS "Coaches can delete their mentees applications" ON public.job_applications;

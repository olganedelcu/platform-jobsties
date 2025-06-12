
-- Check current RLS policies on weekly_job_recommendations table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'weekly_job_recommendations';

-- Drop the existing policy that might be too restrictive
DROP POLICY IF EXISTS "Coaches can manage recommendations for their mentees" ON public.weekly_job_recommendations;

-- Create a more comprehensive policy that allows both coaches and mentees to update recommendations
CREATE POLICY "Coaches and mentees can manage recommendations" 
  ON public.weekly_job_recommendations 
  FOR ALL 
  USING (
    -- Allow if user is the coach who created the recommendation
    coach_id = auth.uid() OR
    -- Allow if user is the mentee for whom the recommendation was made
    mentee_id = auth.uid() OR
    -- Allow if user is a coach assigned to this mentee
    EXISTS (
      SELECT 1 FROM public.coach_mentee_assignments cma 
      WHERE cma.coach_id = auth.uid() 
      AND cma.mentee_id = weekly_job_recommendations.mentee_id 
      AND cma.is_active = true
    )
  )
  WITH CHECK (
    -- Same permissions for inserts/updates
    coach_id = auth.uid() OR
    mentee_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.coach_mentee_assignments cma 
      WHERE cma.coach_id = auth.uid() 
      AND cma.mentee_id = weekly_job_recommendations.mentee_id 
      AND cma.is_active = true
    )
  );

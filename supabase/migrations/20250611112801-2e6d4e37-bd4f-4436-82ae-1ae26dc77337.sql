
-- Fix the RLS policy for weekly_job_recommendations table
DROP POLICY IF EXISTS "Coaches can manage recommendations for their mentees" ON public.weekly_job_recommendations;

-- Create a new policy that properly allows coaches to insert recommendations
CREATE POLICY "Coaches can manage recommendations for their mentees" 
  ON public.weekly_job_recommendations 
  FOR ALL 
  USING (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.coach_mentee_assignments cma 
      WHERE cma.coach_id = auth.uid() 
      AND cma.mentee_id = weekly_job_recommendations.mentee_id 
      AND cma.is_active = true
    )
  )
  WITH CHECK (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.coach_mentee_assignments cma 
      WHERE cma.coach_id = auth.uid() 
      AND cma.mentee_id = weekly_job_recommendations.mentee_id 
      AND cma.is_active = true
    )
  );

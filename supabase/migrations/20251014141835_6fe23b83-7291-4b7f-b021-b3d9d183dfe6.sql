-- Allow students to view all weekly job recommendations
CREATE POLICY "Students can view all job recommendations"
ON public.weekly_job_recommendations
FOR SELECT
TO authenticated
USING (
  get_current_user_role() = 'STUDENT'
);
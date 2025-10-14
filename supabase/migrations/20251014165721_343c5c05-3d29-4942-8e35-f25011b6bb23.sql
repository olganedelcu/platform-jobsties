-- Drop the existing foreign key constraint
ALTER TABLE public.weekly_job_recommendations 
DROP CONSTRAINT IF EXISTS fk_weekly_job_recommendations_mentee;

-- Recreate the foreign key with ON DELETE CASCADE
ALTER TABLE public.weekly_job_recommendations 
ADD CONSTRAINT fk_weekly_job_recommendations_mentee 
FOREIGN KEY (mentee_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Also update the coach_id foreign key to CASCADE if it exists
ALTER TABLE public.weekly_job_recommendations 
DROP CONSTRAINT IF EXISTS fk_weekly_job_recommendations_coach;

ALTER TABLE public.weekly_job_recommendations 
ADD CONSTRAINT fk_weekly_job_recommendations_coach 
FOREIGN KEY (coach_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
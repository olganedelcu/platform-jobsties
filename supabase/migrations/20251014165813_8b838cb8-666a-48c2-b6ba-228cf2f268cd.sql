-- First, make the mentee_id and coach_id columns nullable
ALTER TABLE public.weekly_job_recommendations 
ALTER COLUMN mentee_id DROP NOT NULL;

ALTER TABLE public.weekly_job_recommendations 
ALTER COLUMN coach_id DROP NOT NULL;

-- Drop the existing foreign key constraints
ALTER TABLE public.weekly_job_recommendations 
DROP CONSTRAINT IF EXISTS fk_weekly_job_recommendations_mentee;

ALTER TABLE public.weekly_job_recommendations 
DROP CONSTRAINT IF EXISTS fk_weekly_job_recommendations_coach;

-- Recreate the foreign keys with ON DELETE SET NULL
ALTER TABLE public.weekly_job_recommendations 
ADD CONSTRAINT fk_weekly_job_recommendations_mentee 
FOREIGN KEY (mentee_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

ALTER TABLE public.weekly_job_recommendations 
ADD CONSTRAINT fk_weekly_job_recommendations_coach 
FOREIGN KEY (coach_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;
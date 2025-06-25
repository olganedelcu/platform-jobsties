
-- Add job_link column to job_applications table if it doesn't exist
-- (checking the schema, it already exists but let's make sure it's properly used)
ALTER TABLE public.job_applications 
ALTER COLUMN job_link SET DEFAULT NULL;

-- Update existing applications that were created from job recommendations
-- This will help link existing data if needed
UPDATE public.job_applications 
SET job_link = wr.job_link
FROM public.weekly_job_recommendations wr
WHERE job_applications.company_name = wr.company_name 
  AND job_applications.job_title = wr.job_title
  AND job_applications.job_link IS NULL;

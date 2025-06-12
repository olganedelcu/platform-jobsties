
-- Add status tracking columns to weekly_job_recommendations table
ALTER TABLE public.weekly_job_recommendations 
ADD COLUMN status VARCHAR(50) DEFAULT 'active',
ADD COLUMN applied_date TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN archived BOOLEAN DEFAULT FALSE,
ADD COLUMN application_stage VARCHAR(50) DEFAULT NULL;

-- Add index for better performance on status queries
CREATE INDEX idx_weekly_job_recommendations_status ON public.weekly_job_recommendations(status);
CREATE INDEX idx_weekly_job_recommendations_archived ON public.weekly_job_recommendations(archived);

-- Update existing records that have been marked as applied (based on job_applications table)
UPDATE public.weekly_job_recommendations 
SET status = 'applied', 
    archived = true,
    applied_date = ja.date_applied::TIMESTAMP WITH TIME ZONE,
    application_stage = 'applied'
FROM public.job_applications ja
WHERE weekly_job_recommendations.company_name = ja.company_name 
  AND weekly_job_recommendations.job_title = ja.job_title
  AND weekly_job_recommendations.mentee_id = ja.mentee_id;

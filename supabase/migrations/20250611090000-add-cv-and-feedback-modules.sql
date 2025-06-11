
-- Add CV and feedback module types to the existing module_files table
ALTER TABLE public.module_files 
DROP CONSTRAINT IF EXISTS module_files_module_type_check;

ALTER TABLE public.module_files 
ADD CONSTRAINT module_files_module_type_check 
CHECK (module_type IN ('cv_optimization', 'linkedin', 'job_search_strategy', 'interview_preparation', 'feedback'));

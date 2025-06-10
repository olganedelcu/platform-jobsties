
-- First, let's check what policies already exist
-- If some policies exist, we'll only create the missing ones

-- Check if the coaches view policy exists, if not create it
DO $$
BEGIN
    -- Try to create the coaches view policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'job_applications' 
        AND policyname = 'Coaches can view all job applications'
    ) THEN
        CREATE POLICY "Coaches can view all job applications" 
          ON public.job_applications 
          FOR SELECT 
          USING (
            EXISTS (
              SELECT 1 FROM public.profiles 
              WHERE profiles.id = auth.uid() 
              AND profiles.role = 'COACH'
            )
          );
    END IF;
    
    -- Try to create the coaches update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'job_applications' 
        AND policyname = 'Coaches can update job applications'
    ) THEN
        CREATE POLICY "Coaches can update job applications" 
          ON public.job_applications 
          FOR UPDATE 
          USING (
            EXISTS (
              SELECT 1 FROM public.profiles 
              WHERE profiles.id = auth.uid() 
              AND profiles.role = 'COACH'
            )
          );
    END IF;
    
    -- Try to create mentee insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'job_applications' 
        AND policyname = 'Mentees can insert their own applications'
    ) THEN
        CREATE POLICY "Mentees can insert their own applications" 
          ON public.job_applications 
          FOR INSERT 
          WITH CHECK (mentee_id = auth.uid());
    END IF;
    
    -- Try to create mentee update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'job_applications' 
        AND policyname = 'Mentees can update their own applications'
    ) THEN
        CREATE POLICY "Mentees can update their own applications" 
          ON public.job_applications 
          FOR UPDATE 
          USING (mentee_id = auth.uid());
    END IF;
    
    -- Try to create mentee delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'job_applications' 
        AND policyname = 'Mentees can delete their own applications'
    ) THEN
        CREATE POLICY "Mentees can delete their own applications" 
          ON public.job_applications 
          FOR DELETE 
          USING (mentee_id = auth.uid());
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Insert some sample data for testing
-- First, let's get some actual user IDs from the profiles table
INSERT INTO public.job_applications (mentee_id, date_applied, company_name, job_title, application_status, interview_stage, recruiter_name, coach_notes)
SELECT 
  p.id as mentee_id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 1 THEN '2025-06-08'::date
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 2 THEN '2025-06-07'::date
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 3 THEN '2025-06-06'::date
    ELSE '2025-06-05'::date
  END as date_applied,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 1 THEN 'Google'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 2 THEN 'Microsoft'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 3 THEN 'Amazon'
    ELSE 'Apple'
  END as company_name,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 1 THEN 'Software Engineer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 2 THEN 'Product Manager'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 3 THEN 'Data Scientist'
    ELSE 'UX Designer'
  END as job_title,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 1 THEN 'interviewing'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 2 THEN 'applied'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 3 THEN 'offer'
    ELSE 'rejected'
  END as application_status,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 1 THEN 'Technical Interview'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 3 THEN 'Final Interview'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 4 THEN 'Design Challenge'
    ELSE NULL
  END as interview_stage,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 1 THEN 'Jane Smith'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 2 THEN 'John Doe'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 3 THEN 'Sarah Johnson'
    ELSE 'Mike Wilson'
  END as recruiter_name,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 1 THEN 'Strong technical background, good communication skills'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 2 THEN 'Need to follow up on application status'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) = 3 THEN 'Excellent performance in all rounds'
    ELSE 'Portfolio needs improvement'
  END as coach_notes
FROM (
  SELECT id, created_at 
  FROM public.profiles 
  WHERE role = 'MENTEE' 
  LIMIT 4
) p
WHERE NOT EXISTS (
  SELECT 1 FROM public.job_applications 
  WHERE mentee_id = p.id
);

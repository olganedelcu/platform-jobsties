
-- Create a table to track applications that coaches have hidden from their view
CREATE TABLE public.coach_hidden_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  hidden_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coach_id, application_id)
);

-- Add RLS to ensure coaches can only manage their own hidden applications
ALTER TABLE public.coach_hidden_applications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows coaches to view their own hidden applications
CREATE POLICY "Coaches can view their own hidden applications" 
ON public.coach_hidden_applications 
FOR SELECT 
USING (auth.uid() = coach_id);

-- Create policy that allows coaches to insert their own hidden applications
CREATE POLICY "Coaches can hide applications" 
ON public.coach_hidden_applications 
FOR INSERT 
WITH CHECK (auth.uid() = coach_id);

-- Create policy that allows coaches to delete their own hidden applications (unhide)
CREATE POLICY "Coaches can unhide applications" 
ON public.coach_hidden_applications 
FOR DELETE 
USING (auth.uid() = coach_id);

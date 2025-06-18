
-- Enable Row Level Security on cv_files table
ALTER TABLE public.cv_files ENABLE ROW LEVEL SECURITY;

-- Allow mentees to view CV files where they are the mentee
CREATE POLICY "Mentees can view their own CV files" 
  ON public.cv_files 
  FOR SELECT 
  USING (mentee_id = auth.uid());

-- Allow coaches to view CV files for their mentees
CREATE POLICY "Coaches can view CV files for their mentees" 
  ON public.cv_files 
  FOR SELECT 
  USING (coach_id = auth.uid());

-- Allow mentees to upload their own CV files (when coach uploads for them)
CREATE POLICY "Allow CV file uploads" 
  ON public.cv_files 
  FOR INSERT 
  WITH CHECK (
    -- Either the coach is uploading for a mentee
    coach_id = auth.uid() OR 
    -- Or the mentee is uploading their own file
    mentee_id = auth.uid()
  );

-- Allow coaches to update CV files they uploaded
CREATE POLICY "Coaches can update their CV files" 
  ON public.cv_files 
  FOR UPDATE 
  USING (coach_id = auth.uid());

-- Allow coaches to delete CV files they uploaded
CREATE POLICY "Coaches can delete their CV files" 
  ON public.cv_files 
  FOR DELETE 
  USING (coach_id = auth.uid());

-- Add missing policy for mentees to view module files
CREATE POLICY "Mentees can view their module files" 
  ON public.module_files 
  FOR SELECT 
  USING (mentee_id = auth.uid());

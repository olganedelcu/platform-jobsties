
-- Create a table for module files (LinkedIn, Job Search Strategy, Interview Preparation)
CREATE TABLE public.module_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentee_id UUID NOT NULL,
  coach_id UUID NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('linkedin', 'job_search_strategy', 'interview_preparation')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.module_files ENABLE ROW LEVEL SECURITY;

-- Create policies for coaches to manage files
CREATE POLICY "Coaches can view module files for their mentees" 
  ON public.module_files 
  FOR SELECT 
  USING (
    coach_id = auth.uid() OR 
    mentee_id = auth.uid()
  );

CREATE POLICY "Coaches can upload module files" 
  ON public.module_files 
  FOR INSERT 
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update their module files" 
  ON public.module_files 
  FOR UPDATE 
  USING (coach_id = auth.uid());

CREATE POLICY "Coaches can delete their module files" 
  ON public.module_files 
  FOR DELETE 
  USING (coach_id = auth.uid());

-- Add updated_at trigger
CREATE TRIGGER update_module_files_updated_at
  BEFORE UPDATE ON public.module_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for module files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('module-files', 'module-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for module files
CREATE POLICY "Users can view module files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'module-files');

CREATE POLICY "Coaches can upload module files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'module-files' AND auth.role() = 'authenticated');

CREATE POLICY "Coaches can update module files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'module-files' AND auth.role() = 'authenticated');

CREATE POLICY "Coaches can delete module files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'module-files' AND auth.role() = 'authenticated');


-- Create weekly_job_recommendations table
CREATE TABLE public.weekly_job_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL,
  mentee_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  job_link TEXT NOT NULL,
  company_name TEXT NOT NULL,
  week_start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.weekly_job_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policy for coaches to manage recommendations for their mentees
CREATE POLICY "Coaches can manage recommendations for their mentees" 
  ON public.weekly_job_recommendations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.coach_mentee_assignments cma 
      WHERE cma.coach_id = auth.uid() 
      AND cma.mentee_id = weekly_job_recommendations.mentee_id 
      AND cma.is_active = true
    )
  );

-- Create policy for mentees to view their own recommendations
CREATE POLICY "Mentees can view their own recommendations" 
  ON public.weekly_job_recommendations 
  FOR SELECT 
  USING (auth.uid() = mentee_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_weekly_job_recommendations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_job_recommendations_updated_at
  BEFORE UPDATE ON public.weekly_job_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_weekly_job_recommendations_updated_at();

-- Add foreign key constraints (references to profiles table since we're using public schema)
ALTER TABLE public.weekly_job_recommendations 
  ADD CONSTRAINT fk_weekly_job_recommendations_coach 
  FOREIGN KEY (coach_id) REFERENCES public.profiles(id);

ALTER TABLE public.weekly_job_recommendations 
  ADD CONSTRAINT fk_weekly_job_recommendations_mentee 
  FOREIGN KEY (mentee_id) REFERENCES public.profiles(id);

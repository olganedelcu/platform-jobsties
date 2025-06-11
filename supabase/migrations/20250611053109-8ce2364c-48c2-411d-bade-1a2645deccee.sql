
-- Create a function to get hidden applications for a coach
CREATE OR REPLACE FUNCTION public.get_hidden_applications(coach_user_id UUID)
RETURNS TABLE(application_id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT cha.application_id
  FROM public.coach_hidden_applications cha
  WHERE cha.coach_id = coach_user_id;
$$;

-- Create a function to hide an application
CREATE OR REPLACE FUNCTION public.hide_application(coach_user_id UUID, app_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.coach_hidden_applications (coach_id, application_id)
  VALUES (coach_user_id, app_id)
  ON CONFLICT (coach_id, application_id) DO NOTHING;
END;
$$;


-- Fix the handle_new_user function to properly handle COACH role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'COACH' THEN 'COACH'
      ELSE 'MENTEE'
    END
  );
  RETURN NEW;
END;
$function$;

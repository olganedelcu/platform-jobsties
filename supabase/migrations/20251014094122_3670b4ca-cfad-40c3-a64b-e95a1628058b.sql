-- Update the handle_new_user function to support STUDENT role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Insert into profiles with proper role handling
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    CASE 
      WHEN UPPER(COALESCE(NEW.raw_user_meta_data ->> 'role', 'MENTEE')) = 'COACH' THEN 'COACH'
      WHEN UPPER(COALESCE(NEW.raw_user_meta_data ->> 'role', 'MENTEE')) = 'STUDENT' THEN 'STUDENT'
      ELSE 'MENTEE'
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;
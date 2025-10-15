-- Create profiles for existing users that don't have one
INSERT INTO public.profiles (id, first_name, last_name, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'first_name', ''),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  au.email,
  CASE 
    WHEN UPPER(COALESCE(au.raw_user_meta_data->>'role', 'MENTEE')) = 'COACH' THEN 'COACH'
    WHEN UPPER(COALESCE(au.raw_user_meta_data->>'role', 'MENTEE')) = 'STUDENT' THEN 'STUDENT'
    ELSE 'MENTEE'
  END as role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;